import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Animal } from './animal.entity';
import { Enclos } from '../../enclos/entities/enclos.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('animal_enclos')
export class AnimalEnclos {
  @ApiProperty({ description: 'Unique identifier for the animal-enclosure association' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Animal ID' })
  @Column()
  animalId: number;

  @ApiProperty({ description: 'Enclosure ID' })
  @Column()
  enclosId: number;

  @ApiProperty({ description: 'Date when the animal was placed in the enclosure' })
  @CreateDateColumn()
  datePlacement: Date;

  @ManyToOne(() => Animal, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'animalId' })
  animal: Animal;

  @ManyToOne(() => Enclos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'enclosId' })
  enclos: Enclos;
} 