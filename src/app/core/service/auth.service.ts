import { Injectable } from '@angular/core';
import {addDoc, collection, Firestore, getDocs, query, where} from "@angular/fire/firestore";
import {Router} from "@angular/router";
import {User} from "../models/user.interface";
import {BehaviorSubject, interval, map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;
  private dynamicCodeSubject = new BehaviorSubject<string>('');
  private isAuthenticated = false;
  private dynamicCodeInterval: any;

  constructor(private firestore: Firestore, private router: Router) {}

  public generateNewDynamicCode(): string {
    const newCode = Math.floor(10000000 + Math.random() * 90000000).toString();
    console.log('Nueva clave dinámica generada: ', newCode);
    this.dynamicCodeSubject.next(newCode);
    return newCode;
  }

  public startDynamicCodeGeneration(): void {
    if (this.isAuthenticated) {
      this.generateNewDynamicCode();
      this.dynamicCodeInterval = interval(20000).pipe(map(() => this.generateNewDynamicCode())).subscribe();
    }
  }

  public stopDynamicCodeGeneration(): void {
    if (this.dynamicCodeInterval) {
      this.dynamicCodeInterval.unsubscribe();
    }
  }

  public setIsAuthenticated(auth: boolean): void {
    this.isAuthenticated = auth;
    if (!auth) {
      this.stopDynamicCodeGeneration();
    }
  }

  public getDynamicCodeObservable(){
    return this.dynamicCodeSubject.asObservable();
  }

  public getDynamicCode(): string {
    return this.dynamicCodeSubject.value;
  }


  public async register(user: User) {
    try {
      const queryFirestore = query(
        collection(this.firestore, 'accounts'),
        where('accountNumber', '==', user.accountNumber)
      );
      const querySnapshot = await getDocs(queryFirestore);

      if (!querySnapshot.empty) {
        throw new Error('El número de cuenta ya está registrado.');
      }

      await addDoc(collection(this.firestore, 'accounts'), user);
      await this.router.navigateByUrl('/auth/login');

    }catch (error){
      console.error('Error al registrar la cuenta: ', error);
      throw error;
    }
  }

  public async signIn(accountNumber: string, password: string): Promise<boolean> {
    try {
      const queryFirestore = query(
        collection(this.firestore, 'accounts'),
        where('accountNumber', '==', accountNumber),
        where('password', '==', password),
      )
      const querySnapshot = await getDocs(queryFirestore);

      if (querySnapshot.empty) {
        return false;
      }

      this.currentUser = querySnapshot.docs[0].data() as User;

      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

      await this.router.navigateByUrl('/dashboard/home');

      return true;

    }catch (error){
      console.error('Error al iniciar sesion:', error);
      return false;
    }
  }

  public async signOut(): Promise<void> {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    this.setIsAuthenticated(false);
    await this.router.navigateByUrl('/auth/login');
  }

  public getCurrentUser(): User | null {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
  }
}
