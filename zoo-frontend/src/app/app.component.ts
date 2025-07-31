
// zoo-frontend/src/app.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    RouterOutlet,
    RouterModule,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  username: string | undefined;

  backendUrl = 'http://localhost:3000'; // ✅ URL de mon backend NestJS

  constructor(
    public auth: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.auth.idTokenClaims$.subscribe((claims) => {
      console.log('🔐 ID Token Claims:', claims);
      this.username = claims?.name; // On recupere le nom de l'utilisateur dans le token
    });
  }

  logout() {
    this.auth.logout().subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  // Appel a mon backend NestJS : j'effectue un appel a une route protégée par un token d'authentification.
  testCallApi() {
    this.auth
      .getAccessTokenSilently({
        authorizationParams: {
          audience: this.backendUrl,
          scope: 'openid profile email',
        },
      })
      .subscribe((accessToken: string) => {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        console.log('📦 PAYLOAD TOKEN:', payload); // Afficher le payload du token pour verifier les informations de l'utilisateur.
        // ✅ Logger l'access token ( pour copier dans Swagger ). Attention : l'access token est une donnee sensible, ne le partage pas.
        console.log('🔐 Access Token:', accessToken);

        // ✅ Appel a une route protégée par un token d'authentification.
        this.http
          .get(`${this.backendUrl}/animaux/1`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .subscribe((data) => {
            console.log('🐾 Réponse API sur une route protégée:', data);
          });
      });
  }
}
