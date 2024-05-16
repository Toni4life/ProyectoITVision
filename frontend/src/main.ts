import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withFetch } from '@angular/common/http';

// Suponiendo que appConfig es un objeto que podría contener configuraciones adicionales
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, {
  ...appConfig,  // Extiende cualquier configuración existente de appConfig
  providers: [
    ...(appConfig.providers || []),  // Incluye providers existentes en appConfig si los hay
    provideHttpClient(withFetch()),  // Añade el provider para HttpClient
  ],
}).catch(err => console.error(err));
