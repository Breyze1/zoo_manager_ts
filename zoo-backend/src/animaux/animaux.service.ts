// animaux.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Animal } from './entities/animal.entity';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { AnimalEnclos } from './entities/animal-enclos.entity';
import { Enclos } from '../enclos/entities/enclos.entity';
import { AssignAnimalEnclosDto } from './dto/assign-animal-enclos.dto';

@Injectable()
export class AnimauxService {
  constructor(
    @InjectRepository(Animal)
    private readonly animalRepo: Repository<Animal>,
    @InjectRepository(AnimalEnclos)
    private readonly animalEnclosRepo: Repository<AnimalEnclos>,
    @InjectRepository(Enclos)
    private readonly enclosRepo: Repository<Enclos>,
  ) {}

  async create(dto: CreateAnimalDto) {
    const animal = this.animalRepo.create(dto);
    return await this.animalRepo.save(animal);
  }

  async findAll() {
    return await this.animalRepo.find();
  }

  async findOne(id: number) {
    const animal = await this.animalRepo.findOneBy({ id });
    if (!animal) {
      throw new NotFoundException(`Animal with ID ${id} not found`);
    }
    return animal;
  }

  async findByName(name: string) {
    return await this.animalRepo
      .createQueryBuilder('animal')
      .where('LOWER(animal.name) LIKE LOWER(:name)', { name: `%${name}%` })
      .getMany();
  }

  async deleteWithId(id: number) {
    const result = await this.animalRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Animal with ID ${id} not found`);
    }
    return { message: `Animal ${id} deleted successfully` };
  }

  async soignerAnimal(id: number) {
    const animal = await this.findOne(id);
    animal.health = 100;
    return await this.animalRepo.save(animal);
  }

  async assignerEnclos(dto: AssignAnimalEnclosDto) {
    // Vérifier que l'animal existe
    const animal = await this.findOne(dto.animalId);
    
    // Vérifier que l'enclos existe
    const enclos = await this.enclosRepo.findOneBy({ id: dto.enclosId });
    if (!enclos) {
      throw new NotFoundException(`Enclos with ID ${dto.enclosId} not found`);
    }

    // Vérifier que l'enclos est actif
    if (enclos.status !== 'active') {
      throw new BadRequestException(`Enclos ${enclos.name} is not active`);
    }

    // Vérifier qu'il y a de l'espace disponible
    if (enclos.currentOccupancy >= enclos.capacity) {
      throw new BadRequestException(`Enclos ${enclos.name} is full (${enclos.currentOccupancy}/${enclos.capacity})`);
    }

    // Vérifier si l'animal n'est pas déjà dans un enclos
    const existingAssignment = await this.animalEnclosRepo.findOne({
      where: { animalId: dto.animalId },
      order: { datePlacement: 'DESC' }
    });

    if (existingAssignment) {
      // Retirer l'animal de l'ancien enclos
      const oldEnclos = await this.enclosRepo.findOneBy({ id: existingAssignment.enclosId });
      if (oldEnclos) {
        oldEnclos.currentOccupancy = Math.max(0, oldEnclos.currentOccupancy - 1);
        await this.enclosRepo.save(oldEnclos);
      }
    }

    // Créer la nouvelle association
    const animalEnclos = this.animalEnclosRepo.create({
      animalId: dto.animalId,
      enclosId: dto.enclosId
    });

    // Mettre à jour l'occupation de l'enclos
    enclos.currentOccupancy += 1;
    await this.enclosRepo.save(enclos);

    // Sauvegarder l'association
    await this.animalEnclosRepo.save(animalEnclos);

    return {
      message: `Animal ${animal.name} assigned to enclos ${enclos.name}`,
      animal: animal,
      enclos: enclos,
      datePlacement: animalEnclos.datePlacement
    };
  }

  async getAnimalEnclos(animalId: number) {
    const assignment = await this.animalEnclosRepo.findOne({
      where: { animalId },
      relations: ['enclos'],
      order: { datePlacement: 'DESC' }
    });

    if (!assignment) {
      return { message: 'Animal not assigned to any enclos' };
    }

    return {
      animalId,
      enclos: assignment.enclos,
      datePlacement: assignment.datePlacement
    };
  }

  async removeAnimalFromEnclos(animalId: number) {
    // Vérifier que l'animal existe
    await this.findOne(animalId);

    // Trouver l'association actuelle
    const assignment = await this.animalEnclosRepo.findOne({
      where: { animalId },
      order: { datePlacement: 'DESC' }
    });

    if (!assignment) {
      throw new NotFoundException(`Animal ${animalId} is not in any enclosure`);
    }

    // Mettre à jour l'occupation de l'enclos
    const enclos = await this.enclosRepo.findOneBy({ id: assignment.enclosId });
    if (enclos) {
      enclos.currentOccupancy = Math.max(0, enclos.currentOccupancy - 1);
      await this.enclosRepo.save(enclos);
    }

    // Supprimer l'association
    await this.animalEnclosRepo.remove(assignment);

    return {
      message: `Animal ${animalId} removed from enclosure ${assignment.enclosId}`,
      animalId,
      enclosId: assignment.enclosId
    };
  }
}
