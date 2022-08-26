import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import 'rxjs/add/operator/do';
import { Router } from '@angular/router';

@Injectable()
export class JWTInterceptorInterceptor implements HttpInterceptor {
  constructor(public auth: AuthService, private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).do(
      (event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // do stuff with response if you want
          if (!this.auth.isAuthenticated()) {
            this.router.navigate(['/login']);
          }
        }
      },
      (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401 || err.status === 403) {
            // redirect to the login route
            // or show a modal
            this.router.navigate(['/login']);
          }
        }
      }
    );
  }
}
