import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class AssignAnimalEnclosDto {
  @ApiProperty({ 
    description: 'ID of the animal to assign',
    example: 1
  })
  @IsNumber()
  @IsPositive()
  animalId: number;

  @ApiProperty({ 
    description: 'ID of the enclosure to assign the animal to',
    example: 1
  })
  @IsNumber()
  @IsPositive()
  enclosId: number;
} 