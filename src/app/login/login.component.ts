import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { TokenStorageService } from '../auth/token-storage.service';
import { AuthenService } from '../services/authen.service';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: any = {
    username: null,
    password: null,
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  constructor(
    private router: Router,
    private authService: AuthService,
    private authenService: AuthenService,
    private tokenStorage: TokenStorageService,
    private sharedService: SharedService
  ) {}
  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.isLoggedIn = true;
      // this.roles = this.tokenStorage.getUser().roles;
    }
  }
  onSubmit(): void {
    const { username, password } = this.form;
    this.authenService.login(username, password).subscribe(
      (data: any) => {
        this.tokenStorage.saveToken(data.access_token);
        this.tokenStorage.saveUser(this.authService.getDecodedToken());
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.sharedService.changeUsername(this.tokenStorage.getUser().sub);
        this.reloadPage();
      },
      (err) => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }
  reloadPage(): void {
    this.router.navigate(['/home']);
  }
}
