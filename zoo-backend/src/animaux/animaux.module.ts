import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimauxController } from './animaux.controller';
import { AnimauxService } from './animaux.service';
import { Animal } from './entities/animal.entity';
import { AnimalEnclos } from './entities/animal-enclos.entity';
import { Enclos } from '../enclos/entities/enclos.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Animal, AnimalEnclos, Enclos])],
  controllers: [AnimauxController],
  providers: [AnimauxService],
})
export class AnimauxModule {}
