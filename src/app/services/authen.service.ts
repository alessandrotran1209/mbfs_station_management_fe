import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, filter, scan } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthenService {
  baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) {}
  public login(username: string, password: string) {
    let body = new FormData();
    body.append('username', username);
    body.append('password', password);

    return this.httpClient
      .post(`${this.baseUrl}/login`, body, {
        observe: 'response',
      })
      .pipe(
        map((data) => {
          return data.body;
        })
      );
  }
}
