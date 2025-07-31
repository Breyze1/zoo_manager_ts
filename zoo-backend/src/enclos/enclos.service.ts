import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enclos } from './entities/enclos.entity';
import { CreateEnclosDto } from './dto/create-enclos.dto';
import { AnimalEnclos } from '../animaux/entities/animal-enclos.entity';
import { Animal } from '../animaux/entities/animal.entity';

@Injectable()
export class EnclosService {
  constructor(
    @InjectRepository(Enclos)
    private readonly enclosRepo: Repository<Enclos>,
    @InjectRepository(AnimalEnclos)
    private readonly animalEnclosRepo: Repository<AnimalEnclos>,
    @InjectRepository(Animal)
    private readonly animalRepo: Repository<Animal>,
  ) {}

  async create(dto: CreateEnclosDto) {
    const enclos = this.enclosRepo.create(dto);
    return await this.enclosRepo.save(enclos);
  }

  async findAll() {
    return await this.enclosRepo.find();
  }

  async findOne(id: number) {
    const enclos = await this.enclosRepo.findOneBy({ id });
    if (!enclos) {
      throw new NotFoundException(`Enclosure with ID ${id} not found`);
    }
    return enclos;
  }

  async update(id: number, dto: Partial<CreateEnclosDto>) {
    const enclos = await this.findOne(id);
    Object.assign(enclos, dto);
    return await this.enclosRepo.save(enclos);
  }

  async updateStatus(id: number, status: string) {
    // Valider le statut
    const validStatuses = ['active', 'maintenance', 'closed'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const enclos = await this.findOne(id);
    enclos.status = status;
    return await this.enclosRepo.save(enclos);
  }

  async getAnimalsInEnclos(enclosId: number) {
    // Vérifier que l'enclos existe
    await this.findOne(enclosId);

    // Récupérer tous les enregistrements pour cet enclos
    const allAnimalEnclos = await this.animalEnclosRepo.find({
      where: { enclosId },
      relations: ['animal'],
      order: { datePlacement: 'DESC' }
    });

    // Grouper par animal et ne garder que le plus récent pour chaque animal
    const animalMap = new Map();
    allAnimalEnclos.forEach(ae => {
      if (!animalMap.has(ae.animalId) || animalMap.get(ae.animalId).datePlacement < ae.datePlacement) {
        animalMap.set(ae.animalId, ae);
      }
    });

    // Recalculer l'occupation réelle et mettre à jour l'enclos si nécessaire
    const realOccupancy = animalMap.size;
    const enclos = await this.findOne(enclosId);
    if (enclos.currentOccupancy !== realOccupancy) {
      enclos.currentOccupancy = realOccupancy;
      await this.enclosRepo.save(enclos);
    }

    // Transformer les données pour le frontend
    return Array.from(animalMap.values()).map(ae => ({
      id: ae.animal.id,
      name: ae.animal.name,
      species: ae.animal.species,
      health: ae.animal.health,
      datePlacement: ae.datePlacement
    }));
  }

  async recalculateEnclosOccupancy(enclosId: number) {
    // Récupérer tous les enregistrements pour cet enclos
    const allAnimalEnclos = await this.animalEnclosRepo.find({
      where: { enclosId },
      order: { datePlacement: 'DESC' }
    });

    // Grouper par animal et ne garder que le plus récent pour chaque animal
    const animalMap = new Map();
    allAnimalEnclos.forEach(ae => {
      if (!animalMap.has(ae.animalId) || animalMap.get(ae.animalId).datePlacement < ae.datePlacement) {
        animalMap.set(ae.animalId, ae);
      }
    });

    // Mettre à jour l'occupation de l'enclos
    const realOccupancy = animalMap.size;
    const enclos = await this.findOne(enclosId);
    enclos.currentOccupancy = realOccupancy;
    await this.enclosRepo.save(enclos);

    return realOccupancy;
  }

  async recalculateAllEnclosOccupancy() {
    // Récupérer tous les enclos
    const allEnclos = await this.enclosRepo.find();
    const results = [];

    // Recalculer l'occupation pour chaque enclos
    for (const enclos of allEnclos) {
      const realOccupancy = await this.recalculateEnclosOccupancy(enclos.id);
      results.push({
        enclosId: enclos.id,
        enclosName: enclos.name,
        oldOccupancy: enclos.currentOccupancy,
        newOccupancy: realOccupancy
      });
    }

    return {
      message: 'All enclosures occupancy recalculated',
      results
    };
  }

  async delete(id: number) {
    const result = await this.enclosRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Enclosure with ID ${id} not found`);
    }
    return { message: `Enclosure ${id} deleted successfully` };
  }

  async findByType(type: string) {
    return await this.enclosRepo.find({ where: { type } });
  }

  async findByStatus(status: string) {
    return await this.enclosRepo.find({ where: { status } });
  }
} 