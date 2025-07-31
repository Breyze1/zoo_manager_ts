import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateEnclosDto {
  @ApiProperty({ 
    description: 'Name of the enclosure',
    example: 'Savanna Lions'
  })
  @IsString()
  name: string;

  @ApiProperty({ 
    description: 'Type of enclosure',
    example: 'savanna',
    enum: ['savanna', 'jungle', 'aquatic', 'desert', 'mountain']
  })
  @IsString()
  type: string;

  @ApiProperty({ 
    description: 'Capacity of the enclosure',
    example: 10,
    minimum: 1,
    maximum: 100
  })
  @IsNumber()
  @Min(1)
  @Max(100)
  capacity: number;

  @ApiProperty({ 
    description: 'Status of the enclosure',
    example: 'active',
    enum: ['active', 'maintenance', 'closed'],
    required: false
  })
  @IsOptional()
  @IsString()
  status?: string;
} 