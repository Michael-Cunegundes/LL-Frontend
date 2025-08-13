import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { routes } from './app.routes';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet ],
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {}


@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    // ... outros imports
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
