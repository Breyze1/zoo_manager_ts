// src/animaux/dto/create-animal.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateAnimalDto {
  @ApiProperty({
    description: 'The name of the animal',
    example: 'Rex',
  })
  @IsString()
  @Length(3, 20)
  name: string;

  @ApiProperty({
    description: 'The species of the animal',
    example: 'Dog',
  })
  species: string;
}
