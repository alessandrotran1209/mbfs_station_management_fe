import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { TokenStorageService } from '../auth/token-storage.service';
import { AuthenService } from '../services/authen.service';
import { SharedService } from '../services/shared.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.scss',
    '../utils/dist/css/adminlte.min.css',
    '../utils/plugins/icheck-bootstrap/icheck-bootstrap.min.css',
    '../utils/plugins/fontawesome-free/css/all.min.css',
  ],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  constructor(
    public fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private authenService: AuthenService,
    private tokenStorage: TokenStorageService,
    private sharedService: SharedService
  ) {
    this.reactiveForm();
  }
  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
  }
  onSubmit(): void {
    console.log(this.form.value);
    const { username, password } = this.form.value;
    this.authenService.login(username, password).subscribe(
      (data: any) => {
        this.tokenStorage.saveToken(data.access_token);
        this.tokenStorage.saveUser(this.authService.getDecodedToken());
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.sharedService.sendData(this.tokenStorage.getUser().sub);
        this.router.navigate(['']);
      },
      (err) => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }
  reloadPage(): void {
    this.router.navigate(['/login']);
  }

  reactiveForm() {
    this.form = this.fb.group({
      username: this.fb.control('', [Validators.required]),
      password: this.fb.control('', [Validators.required]),
    });
  }
}
