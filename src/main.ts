// src/main.ts - Não precisa alterar, SessionService já é @Injectable({ providedIn: 'root' })
import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      RouterModule.forRoot(routes),
      HttpClientModule
    )
  ]
}).catch(err => console.error(err));

// ✅ O SessionService é automaticamente disponibilizado porque tem @Injectable({ providedIn: 'root' })
