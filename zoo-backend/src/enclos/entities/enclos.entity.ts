import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Enclos {
  @ApiProperty({ description: 'Unique identifier for the enclosure' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Name of the enclosure' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Type of enclosure (e.g., savanna, jungle, aquatic)' })
  @Column()
  type: string;

  @ApiProperty({ description: 'Capacity of the enclosure (number of animals)' })
  @Column()
  capacity: number;

  @ApiProperty({ description: 'Current number of animals in the enclosure' })
  @Column({ default: 0 })
  currentOccupancy: number;

  @ApiProperty({ description: 'Status of the enclosure (active, maintenance, closed)' })
  @Column({ default: 'active' })
  status: string;

  @ApiProperty({ description: 'Date when the enclosure was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Date when the enclosure was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;
} 