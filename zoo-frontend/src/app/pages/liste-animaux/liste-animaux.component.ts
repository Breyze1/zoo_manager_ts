// zoo-frontend/src/app/liste-animaux/liste-animaux.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import { EnclosDialogComponent } from '../../components/enclos-dialog/enclos-dialog.component';

@Component({
  selector: 'app-liste-animaux',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatButtonModule, 
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './liste-animaux.component.html',
  styleUrls: ['./liste-animaux.component.scss']
})
export class ListeAnimauxComponent implements OnInit {
  displayedColumns: string[] = ['name', 'species', 'health', 'actions'];
  dataSource: any[] = [];
  
  showAddForm = false;
  searchTerm = '';
  userRoles: string[] = [];
  
  newAnimal = {
    name: '',
    species: '',
    health: 100
  };

  constructor(
    private http: HttpClient,
    public auth: AuthService,
    private dialog: MatDialog
  ) {}
  
  // OnInit -> au demarrage, on appelle l'API qui nous renvoie la liste des animaux
  ngOnInit(): void {
    this.loadAnimals();
    this.loadUserRoles();
  }

  async loadAnimals(): Promise<void> {
    try {
      const token = await this.auth.getAccessTokenSilently().toPromise();
      const response = await fetch('http://localhost:3000/animaux', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const animaux = await response.json();
        this.dataSource = animaux;
      } else {
        console.error('Erreur lors du chargement des animaux:', response.status);
      }
    } catch (error) {
      console.error('Error loading animals:', error);
    }
  }

  loadUserRoles(): void {
    this.auth.isAuthenticated$.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        // Récupérer directement depuis l'access token car les rôles sont là
        this.auth.getAccessTokenSilently().subscribe((token) => {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const roles = payload['https://zooapi.com/roles'];
            if (roles) {
              this.userRoles = Array.isArray(roles) ? roles : [roles];
              console.log('Rôles chargés:', this.userRoles);
              
              // Réinitialiser les propriétés mémorisées
              this._hasRoleVeterinaire = false;
              this._hasRoleGardien = false;
              this._hasRoleVisiteur = false;
            }
          } catch (error) {
            console.log('Erreur lors du décodage du token:', error);
          }
        });
      } else {
        this.userRoles = [];
        // Réinitialiser les propriétés mémorisées
        this._hasRoleVeterinaire = false;
        this._hasRoleGardien = false;
        this._hasRoleVisiteur = false;
      }
    });
  }

  // Propriétés mémorisées pour éviter les recalculs
  private _hasRoleVeterinaire: boolean = false;
  private _hasRoleGardien: boolean = false;
  private _hasRoleVisiteur: boolean = false;

  hasRole(role: string): boolean {
    // Mémoriser les résultats pour éviter les recalculs constants
    switch (role) {
      case 'veterinaire':
        if (this._hasRoleVeterinaire === false && this.userRoles.includes(role)) {
          this._hasRoleVeterinaire = true;
        }
        return this._hasRoleVeterinaire;
      case 'gardien':
        if (this._hasRoleGardien === false && this.userRoles.includes(role)) {
          this._hasRoleGardien = true;
        }
        return this._hasRoleGardien;
      case 'visiteur':
        if (this._hasRoleVisiteur === false && this.userRoles.includes(role)) {
          this._hasRoleVisiteur = true;
        }
        return this._hasRoleVisiteur;
      default:
        return this.userRoles.includes(role);
    }
  }

  voirDetails(animal: any): void {
    console.log('Détails de l\'animal:', animal);
    alert(`Détails de ${animal.name}:\nEspèce: ${animal.species}\nSanté: ${animal.health || 'Inconnu'}`);
  }

  async addAnimal(): Promise<void> {
    try {
      const token = await this.auth.getAccessTokenSilently().toPromise();
      const response = await fetch('http://localhost:3000/animaux', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(this.newAnimal),
      });

      if (response.ok) {
        this.newAnimal = { name: '', species: '', health: 100 };
        this.showAddForm = false;
        await this.loadAnimals();
      } else {
        console.error('Erreur lors de l\'ajout de l\'animal:', response.status);
      }
    } catch (error) {
      console.error('Error adding animal:', error);
    }
  }

  async searchByName(): Promise<void> {
    if (this.searchTerm.trim()) {
      try {
        const token = await this.auth.getAccessTokenSilently().toPromise();
        const response = await fetch(`http://localhost:3000/animaux/search/name?name=${encodeURIComponent(this.searchTerm.trim())}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const animaux = await response.json();
          this.dataSource = animaux;
        }
      } catch (error) {
        console.error('Error searching animals:', error);
      }
    } else {
      await this.loadAnimals();
    }
  }

  async soignerAnimal(id: number): Promise<void> {
    try {
      const token = await this.auth.getAccessTokenSilently().toPromise();
      const response = await fetch(`http://localhost:3000/animaux/soignerAnimal/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        this.loadAnimals();
        alert('Animal soigné avec succès !');
      } else {
        alert('Erreur lors du soin de l\'animal');
      }
    } catch (error) {
      console.error('Error healing animal:', error);
      alert('Erreur lors du soin de l\'animal');
    }
  }

  async deleteAnimal(id: number): Promise<void> {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet animal ?')) {
      try {
        const token = await this.auth.getAccessTokenSilently().toPromise();
        const response = await fetch(`http://localhost:3000/animaux/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          this.loadAnimals();
          alert('Animal supprimé avec succès !');
        } else {
          alert('Erreur lors de la suppression de l\'animal');
        }
      } catch (error) {
        console.error('Error deleting animal:', error);
        alert('Erreur lors de la suppression de l\'animal');
      }
    }
  }

  async mettreEnEnclos(animal: any): Promise<void> {
    const dialogRef = this.dialog.open(EnclosDialogComponent, {
      width: '500px',
      data: {
        animalId: animal.id,
        animalName: animal.name
      }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          const token = await this.auth.getAccessTokenSilently().toPromise();
          const response = await fetch('http://localhost:3000/animaux/assigner-enclos', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              animalId: result.animalId,
              enclosId: result.enclosId
            }),
          });

          if (response.ok) {
            const data = await response.json();
            alert(`✅ ${data.message}`);
            // Recharger les données pour mettre à jour l'affichage
            this.loadAnimals();
          } else {
            const error = await response.json();
            alert(`❌ Erreur: ${error.message || 'Erreur lors de l\'assignation'}`);
          }
        } catch (error) {
          console.error('Error assigning animal to enclosure:', error);
          alert('❌ Erreur lors de l\'assignation de l\'animal à l\'enclos');
        }
      }
    });
  }
}
