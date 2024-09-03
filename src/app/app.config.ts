import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {initializeApp, provideFirebaseApp} from "@angular/fire/app";
import {environment} from "../environments/environment";
import {getFirestore, provideFirestore} from "@angular/fire/firestore";
import {getAuth, provideAuth} from "@angular/fire/auth";

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    provideFirebaseApp(() => initializeApp({
      apiKey: "AIzaSyB3p41x-eoZbRd_E1QbzAeaZGwrKFBgqHA",
      authDomain: "ng-atm-project.firebaseapp.com",
      projectId: "ng-atm-project",
      storageBucket: "ng-atm-project.appspot.com",
      messagingSenderId: "559269240147",
      appId: "1:559269240147:web:1cbb26366d4b14d98b55a6"
    })),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
  ],
};
