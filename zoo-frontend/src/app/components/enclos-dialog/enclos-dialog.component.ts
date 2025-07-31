import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { EnclosDto } from '../../dto/enclos.dto';
import { AuthService } from '@auth0/auth0-angular';

export interface EnclosDialogData {
  animalId: number;
  animalName: string;
}

export interface StatusDialogData {
  enclosId: number;
  enclosName: string;
  currentStatus: string;
}

interface AnimalEnclosResponse {
  animalId: number;
  enclos: EnclosDto;
  datePlacement: Date;
}

@Component({
  selector: 'app-enclos-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './enclos-dialog.component.html',
  styleUrls: ['./enclos-dialog.component.scss']
})
export class EnclosDialogComponent implements OnInit {
  enclos: EnclosDto[] = [];
  selectedEnclosId: number | null = null;
  loading = true;
  currentEnclos: EnclosDto | null = null;

  constructor(
    public dialogRef: MatDialogRef<EnclosDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EnclosDialogData,
    private http: HttpClient,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCurrentEnclos();
    this.loadAvailableEnclos();
  }

  async loadCurrentEnclos(): Promise<void> {
    try {
      const token = await this.auth.getAccessTokenSilently().toPromise();
      const response = await fetch(`http://localhost:3000/animaux/${this.data.animalId}/enclos`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.enclos) {
          this.currentEnclos = data.enclos;
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'enclos actuel:', error);
      // Si l'animal n'est pas dans un enclos ou autre erreur, on continue sans afficher l'enclos actuel
    }
  }

  async loadAvailableEnclos(): Promise<void> {
    try {
      const token = await this.auth.getAccessTokenSilently().toPromise();
      const response = await fetch('http://localhost:3000/enclos', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const enclos = await response.json();
        // Filtrer les enclos qui ont de l'espace disponible
        this.enclos = enclos.filter((enclos: EnclosDto) => 
          enclos.status === 'active' && 
          enclos.currentOccupancy < enclos.capacity
        );
        this.loading = false;
      }
    } catch (error) {
      console.error('Erreur lors du chargement des enclos:', error);
      this.loading = false;
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.selectedEnclosId) {
      this.dialogRef.close({
        animalId: this.data.animalId,
        enclosId: this.selectedEnclosId
      });
    }
  }

  getEnclosDisplayName(enclos: EnclosDto): string {
    return `${enclos.name} (${enclos.type}) - ${enclos.currentOccupancy}/${enclos.capacity} places`;
  }
} 