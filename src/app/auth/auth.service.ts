import { Injectable } from '@angular/core';
import { JwtHelper, tokenNotExpired } from 'angular2-jwt';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private tokenStorage: TokenStorageService) {}
  jwtHelper: JwtHelper = new JwtHelper();
  public getToken(): string {
    return this.tokenStorage.getToken();
  }
  public isAuthenticated(): boolean {
    // get the token
    const token = this.getToken();
    // return a boolean reflecting
    // whether or not the token is expired
    return tokenNotExpired(null, token);
  }
  public getDecodedToken() {
    return this.jwtHelper.decodeToken(this.tokenStorage.getToken());
  }
}
