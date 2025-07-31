import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule],
  template: `<h1>Bienvenue au zoo !</h1><p>Sélectionnez une section dans la barre de navigation.</p>`
})
export class AccueilComponent {} 