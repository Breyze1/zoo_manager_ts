import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EnclosDto, CreateEnclosDto } from '../../dto/enclos.dto';
import { AuthService } from '@auth0/auth0-angular';
import { StatusDialogComponent, StatusDialogData } from '../../components/status-dialog/status-dialog.component';

@Component({
  selector: 'app-liste-enclos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  templateUrl: './liste-enclos.component.html',
  styleUrls: ['./liste-enclos.component.scss']
})
export class ListeEnclosComponent implements OnInit {
  enclos: EnclosDto[] = [];
  displayedColumns: string[] = ['id', 'name', 'type', 'capacity', 'currentOccupancy', 'status', 'actions'];
  
  newEnclos: CreateEnclosDto = {
    name: '',
    type: '',
    capacity: 0
  };

  showAddForm = false;
  selectedType = '';
  selectedStatus = '';
  userRoles: string[] = [];

  constructor(
    public auth: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadEnclos();
    this.loadUserRoles();
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
              console.log('Enclos - Rôles chargés:', this.userRoles);
              
              // Réinitialiser les propriétés mémorisées
              this._hasRoleGardien = false;
            }
          } catch (error) {
            console.log('Enclos - Erreur lors du décodage du token:', error);
          }
        });
      } else {
        this.userRoles = [];
        // Réinitialiser les propriétés mémorisées
        this._hasRoleGardien = false;
      }
    });
  }

  // Propriétés mémorisées pour éviter les recalculs
  private _hasRoleGardien: boolean = false;

  hasRole(role: string): boolean {
    // Mémoriser les résultats pour éviter les recalculs constants
    if (role === 'gardien') {
      if (this._hasRoleGardien === false && this.userRoles.includes(role)) {
        this._hasRoleGardien = true;
      }
      return this._hasRoleGardien;
    }
    return this.userRoles.includes(role);
  }

  async loadEnclos(): Promise<void> {
    try {
      const token = await this.auth.getAccessTokenSilently().toPromise();
      const response = await fetch('http://localhost:3000/enclos', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        this.enclos = await response.json();
      } else {
        console.error('Erreur lors du chargement des enclos:', response.status);
      }
    } catch (error) {
      console.error('Error loading enclos:', error);
    }
  }

  async addEnclos(): Promise<void> {
    try {
      const token = await this.auth.getAccessTokenSilently().toPromise();
      const response = await fetch('http://localhost:3000/enclos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(this.newEnclos),
      });

      if (response.ok) {
        this.newEnclos = { name: '', type: '', capacity: 0 };
        this.showAddForm = false;
        await this.loadEnclos();
      } else {
        console.error('Erreur lors de l\'ajout de l\'enclos:', response.status);
      }
    } catch (error) {
      console.error('Error adding enclos:', error);
    }
  }

  async deleteEnclos(id: number): Promise<void> {
    if (confirm('Are you sure you want to delete this enclosure?')) {
      try {
        const token = await this.auth.getAccessTokenSilently().toPromise();
        const response = await fetch(`http://localhost:3000/enclos/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          await this.loadEnclos();
        } else {
          console.error('Erreur lors de la suppression de l\'enclos:', response.status);
        }
      } catch (error) {
        console.error('Error deleting enclos:', error);
      }
    }
  }

  openStatusDialog(enclos: EnclosDto): void {
    const dialogData: StatusDialogData = {
      enclosId: enclos.id,
      enclosName: enclos.name,
      currentStatus: enclos.status
    };

    const dialogRef = this.dialog.open(StatusDialogComponent, {
      data: dialogData,
      width: '1000px',
      maxWidth: '95vw',
      maxHeight: '90vh'
    });

    // Écouter l'événement de retrait d'animal
    dialogRef.componentInstance.animalRemoved.subscribe((data: {animalId: number, enclosId: number}) => {
      // Mettre à jour l'occupation de l'enclos dans la liste locale
      const enclosIndex = this.enclos.findIndex(e => e.id === data.enclosId);
      if (enclosIndex !== -1) {
        this.enclos[enclosIndex].currentOccupancy = Math.max(0, this.enclos[enclosIndex].currentOccupancy - 1);
      }
      
      this.snackBar.open(
        'Animal retiré de l\'enclos avec succès',
        'Fermer',
        { duration: 3000 }
      );
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        // Mise à jour du statut et des suppressions d'animaux
        this.loadEnclos(); // Recharger la liste
        
        let message = `Statut de l'enclos "${enclos.name}" modifié avec succès`;
        if (result.animalsRemoved && result.animalsRemoved > 0) {
          message += ` et ${result.animalsRemoved} animal(s) retiré(s)`;
        }
        
        this.snackBar.open(message, 'Fermer', { duration: 3000 });
      } else if (result && !result.success) {
        this.snackBar.open(
          `Erreur lors de la modification: ${result.error}`,
          'Fermer',
          { duration: 5000 }
        );
      }
    });
  }

  async filterByType(): Promise<void> {
    if (this.selectedType) {
      try {
        const token = await this.auth.getAccessTokenSilently().toPromise();
        const response = await fetch(`http://localhost:3000/enclos/search/type?type=${this.selectedType}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          this.enclos = data;
        }
      } catch (error) {
        console.error('Error filtering by type:', error);
      }
    } else {
      await this.loadEnclos();
    }
  }

  async filterByStatus(): Promise<void> {
    if (this.selectedStatus) {
      try {
        const token = await this.auth.getAccessTokenSilently().toPromise();
        const response = await fetch(`http://localhost:3000/enclos/search/status?status=${this.selectedStatus}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          this.enclos = data;
        }
      } catch (error) {
        console.error('Error filtering by status:', error);
      }
    } else {
      await this.loadEnclos();
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return 'green';
      case 'maintenance': return 'orange';
      case 'closed': return 'red';
      default: return 'gray';
    }
  }
} 