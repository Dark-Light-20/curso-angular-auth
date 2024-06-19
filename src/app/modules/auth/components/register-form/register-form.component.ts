import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { RequestStatus } from '@models/request-status.model';
import { AuthService } from '@services/auth.service';

import { CustomValidators } from '@utils/validators';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
})
export class RegisterFormComponent {
  private readonly _authService = inject(AuthService);

  formUser = this.formBuilder.nonNullable.group({
    email: ['', [Validators.email, Validators.required]],
  });

  form = this.formBuilder.nonNullable.group(
    {
      name: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.minLength(8), Validators.required]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: [
        CustomValidators.MatchValidator('password', 'confirmPassword'),
      ],
    }
  );
  status: RequestStatus = 'init';
  statusUser: RequestStatus = 'init';
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  showPassword = false;
  responseError = '';
  showRegister = false;

  constructor(private formBuilder: FormBuilder, private router: Router) {}

  register() {
    if (this.form.valid) {
      this.status = 'loading';
      this.responseError = '';
      const { name, email, password } = this.form.getRawValue();
      this._authService.register(name, email, password).subscribe({
        next: () => {
          this.status = 'success';
          this.router.navigateByUrl('/login');
        },
        error: (err) => {
          this.status = 'failed';
          if (err.error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            this.responseError = 'Email already registered';
          } else {
            this.responseError = 'Something went wrong';
          }
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  validateUser() {
    if (this.formUser.valid) {
      this.statusUser = 'loading';
      const { email } = this.formUser.getRawValue();
      this._authService.isAvailable(email).subscribe({
        next: (response) => {
          this.statusUser = 'success';
          if (response.isAvailable) {
            this.form.controls.email.setValue(email);
            this.showRegister = true;
          } else {
            this.router.navigate(['/login'], {
              queryParams: { email },
            });
          }
        },
        error: () => (this.statusUser = 'failed'),
      });
    } else {
      this.formUser.markAllAsTouched();
    }
  }
}
