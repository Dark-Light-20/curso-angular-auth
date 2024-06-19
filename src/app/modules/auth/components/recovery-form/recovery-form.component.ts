import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { RequestStatus } from '@models/request-status.model';
import { AuthService } from '@services/auth.service';

import { CustomValidators } from '@utils/validators';

@Component({
  selector: 'app-recovery-form',
  templateUrl: './recovery-form.component.html',
})
export class RecoveryFormComponent {
  private readonly _authService = inject(AuthService);
  private readonly _activatedRouter = inject(ActivatedRoute);
  private readonly _router = inject(Router);

  form = this.formBuilder.nonNullable.group(
    {
      newPassword: ['', [Validators.minLength(8), Validators.required]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: [
        CustomValidators.MatchValidator('newPassword', 'confirmPassword'),
      ],
    }
  );
  status: RequestStatus = 'init';
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  showPassword = false;
  token = '';

  constructor(private formBuilder: FormBuilder) {
    this.retrieveToken();
  }

  retrieveToken() {
    this._activatedRouter.queryParamMap.subscribe((params) => {
      const token = params.get('token');
      if (token) {
        this.token = token;
      } else {
        this._router.navigateByUrl('/login');
      }
    });
  }

  recovery() {
    if (this.form.valid) {
      this.status = 'loading';
      const { newPassword } = this.form.getRawValue();
      this._authService.changePassword(this.token, newPassword).subscribe({
        next: () => {
          this.status = 'success';
          this._router.navigateByUrl('/login');
        },
        error: () => (this.status = 'failed'),
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
