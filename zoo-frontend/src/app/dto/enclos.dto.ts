export interface EnclosDto {
  id: number;
  name: string;
  type: string;
  capacity: number;
  currentOccupancy: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEnclosDto {
  name: string;
  type: string;
  capacity: number;
  status?: string;
} 