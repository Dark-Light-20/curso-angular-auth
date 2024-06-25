import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit {
  private readonly _authService = inject(AuthService);

  ngOnInit(): void {
    this._authService.getProfile().subscribe();
  }
}
