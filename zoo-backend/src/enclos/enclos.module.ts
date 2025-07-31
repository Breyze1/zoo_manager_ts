import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnclosController } from './enclos.controller';
import { EnclosService } from './enclos.service';
import { Enclos } from './entities/enclos.entity';
import { Animal } from '../animaux/entities/animal.entity';
import { AnimalEnclos } from '../animaux/entities/animal-enclos.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Enclos, Animal, AnimalEnclos])],
  controllers: [EnclosController],
  providers: [EnclosService],
})
export class EnclosModule {} 