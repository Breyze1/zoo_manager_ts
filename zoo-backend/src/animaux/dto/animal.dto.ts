import { ApiProperty } from '@nestjs/swagger';

export class AnimalDto {
  @ApiProperty({
    description: 'The unique identifier of the animal',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The name of the animal',
    example: 'Rex',
  })
  name: string;

  @ApiProperty({
    description: 'The species of the animal',
    example: 'Dog',
  })
  species: string;

  @ApiProperty({
    description: 'The health of the animal',
    example: 100,
  })
  health: number;
}
