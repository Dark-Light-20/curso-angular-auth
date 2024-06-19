import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faPen, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { RequestStatus } from '@models/request-status.model';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent {
  private readonly _authService = inject(AuthService);
  private readonly _activatedRouter = inject(ActivatedRoute);

  form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  faPen = faPen;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  showPassword = false;
  status: RequestStatus = 'init';

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.preloadEmail();
  }

  preloadEmail() {
    this._activatedRouter.queryParamMap.subscribe((params) => {
      const email = params.get('email');
      if (email) {
        this.form.controls.email.setValue(email);
      }
    });
  }

  doLogin() {
    if (this.form.valid) {
      this.status = 'loading';
      const { email, password } = this.form.getRawValue();
      this._authService.login(email, password).subscribe({
        next: () => {
          this.router.navigateByUrl('/app');
          this.status = 'success';
        },
        error: () => (this.status = 'failed'),
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
