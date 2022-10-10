import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthenService } from 'src/app/services/authen.service';
import { SharedService } from 'src/app/services/shared.service';
import { TokenStorageService } from '../../auth/token-storage.service';

@Component({
  selector: 'app-change-pw',
  templateUrl: './change-pw.component.html',
  styleUrls: [
    './change-pw.component.scss',
    '../login.component.scss',
    '../../utils/dist/css/adminlte.min.css',
    '../../utils/plugins/icheck-bootstrap/icheck-bootstrap.min.css',
    '../../utils/plugins/fontawesome-free/css/all.min.css',
  ],
})
export class ChangePwComponent {
  constructor(
    private authService: AuthService,
    private authenService: AuthenService,
    private sharedService: SharedService,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {
    if (!authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }

    this.form = new FormGroup({
      password: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      dupNewPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });

    this.form.controls['dupNewPassword'].addValidators(
      this.passwordMatcherValidator()
    );
  }

  form!: FormGroup;
  inCorrectPassword = false;
  onSubmit(): void {
    this.authenService.changePassword(this.form.value).subscribe(
      (response: any) => {
        this.tokenStorage.signOut();
        this.sharedService.sendData('');
        this.router.navigate(['/login']);
      },
      (error) => {
        if (error.error.detail == 'Incorrect password') {
          this.form.controls['password'].setErrors({ incorrectPassword: true });
        }
      }
    );
  }

  /* Shorthands for form controls (used from within template) */
  get newPassword() {
    return this.form.get('newPassword');
  }
  get dupNewPassword() {
    return this.form.get('dupNewPassword');
  }

  onPasswordInput() {
    if (this.form.hasError('passwordMismatch'))
      this.dupNewPassword.setErrors([{ passwordMismatch: true }]);
    else this.dupNewPassword.setErrors(null);
  }

  passwordMatchValidator(g: AbstractControl) {
    const password = g.get('newPassword').value;
    const confirm = g.get('dupNewPassword').value;
    return password === confirm ? null : { mismatch: true };
  }

  getErrorMessage(controlName: string) {
    if (this.form.controls[controlName].hasError('minlength')) {
      return 'Mật khẩu phải có ít nhất 8 ký tự';
    }
    if (this.form.controls[controlName].hasError('required')) {
      return 'Mật khẩu không được để trống';
    }
    if (this.form.controls[controlName].hasError('mismatch')) {
      return 'Mật khẩu mới không trùng khớp';
    }
    if (this.form.controls[controlName].hasError('incorrectPassword')) {
      return 'Mật khẩu không trùng khớp';
    }
    return '';
  }

  passwordMatcherValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return this.form.controls['newPassword'].value == control.value
        ? null
        : { mismatch: true };
    };
  }
}
