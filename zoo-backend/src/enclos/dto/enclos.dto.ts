import { ApiProperty } from '@nestjs/swagger';

export class EnclosDto {
  @ApiProperty({ description: 'Unique identifier for the enclosure' })
  id: number;

  @ApiProperty({ description: 'Name of the enclosure' })
  name: string;

  @ApiProperty({ description: 'Type of enclosure' })
  type: string;

  @ApiProperty({ description: 'Capacity of the enclosure' })
  capacity: number;

  @ApiProperty({ description: 'Current number of animals in the enclosure' })
  currentOccupancy: number;

  @ApiProperty({ description: 'Status of the enclosure' })
  status: string;

  @ApiProperty({ description: 'Date when the enclosure was created' })
  createdAt: Date;

  @ApiProperty({ description: 'Date when the enclosure was last updated' })
  updatedAt: Date;
} 