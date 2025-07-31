import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';

export interface StatusDialogData {
  enclosId: number;
  enclosName: string;
  currentStatus: string;
}

interface AnimalInEnclos {
  id: number;
  name: string;
  species: string;
  health: number;
  datePlacement: Date;
}

@Component({
  selector: 'app-status-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatTabsModule
  ],
  templateUrl: './status-dialog.component.html',
  styleUrls: ['./status-dialog.component.scss']
})
export class StatusDialogComponent implements OnInit {
  selectedStatus: string;
  loading = false;
  animalsLoading = false;
  animals: AnimalInEnclos[] = [];
  animalsToRemove: number[] = []; // Liste des IDs d'animaux à supprimer
  @Output() animalRemoved = new EventEmitter<{animalId: number, enclosId: number}>();

  constructor(
    public dialogRef: MatDialogRef<StatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StatusDialogData,
    private http: HttpClient,
    private auth: AuthService
  ) {
    this.selectedStatus = data.currentStatus;
  }

  ngOnInit(): void {
    this.loadAnimalsInEnclos();
  }

  async loadAnimalsInEnclos(): Promise<void> {
    this.animalsLoading = true;
    try {
      const token = await this.auth.getAccessTokenSilently().toPromise();
      const response = await fetch(`http://localhost:3000/enclos/${this.data.enclosId}/animals`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const animals = await response.json();
        this.animals = animals;
      }
    } catch (error) {
      console.error('Erreur lors du chargement des animaux:', error);
    } finally {
      this.animalsLoading = false;
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  async onConfirm(): Promise<void> {
    this.loading = true;
    
    try {
      const token = await this.auth.getAccessTokenSilently().toPromise();
      
      // Exécuter toutes les suppressions d'animaux en attente
      for (const animalId of this.animalsToRemove) {
        const response = await fetch(`http://localhost:3000/animaux/${animalId}/enclos`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          // Émettre l'événement pour notifier le parent
          this.animalRemoved.emit({animalId, enclosId: this.data.enclosId});
        }
      }

      // Modifier le statut si nécessaire
      if (this.selectedStatus && this.selectedStatus !== this.data.currentStatus) {
        const statusResponse = await fetch(`http://localhost:3000/enclos/${this.data.enclosId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ status: this.selectedStatus }),
        });
        
        if (!statusResponse.ok) {
          throw new Error('Erreur lors de la modification du statut');
        }
      }

      this.loading = false;
      this.dialogRef.close({
        success: true,
        enclosId: this.data.enclosId,
        newStatus: this.selectedStatus,
        animalsRemoved: this.animalsToRemove.length
      });
    } catch (error) {
      console.error('Erreur lors de la confirmation:', error);
      this.loading = false;
      this.dialogRef.close({
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }

  removeAnimalFromEnclos(animalId: number): void {
    if (confirm(`Êtes-vous sûr de vouloir retirer cet animal de l'enclos ?`)) {
      // Ajouter l'animal à la liste des suppressions en attente
      if (!this.animalsToRemove.includes(animalId)) {
        this.animalsToRemove.push(animalId);
      }
      
      // Retirer visuellement l'animal de la liste (mais pas encore de la base de données)
      this.animals = this.animals.filter(animal => animal.id !== animalId);
    }
  }

  isAnimalMarkedForRemoval(animalId: number): boolean {
    return this.animalsToRemove.includes(animalId);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return '#4caf50';
      case 'maintenance': return '#ff9800';
      case 'closed': return '#f44336';
      default: return '#9e9e9e';
    }
  }

  getHealthColor(health: number): string {
    if (health >= 80) return '#4caf50';
    if (health >= 50) return '#ff9800';
    return '#f44336';
  }
} 