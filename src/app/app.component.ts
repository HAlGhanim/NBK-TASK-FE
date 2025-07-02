import { Component, effect, signal, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent {
  protected title = 'NBK-TASK-FE';
  isLoggedIn = signal(false);

  private cookieService = inject(CookieService);
  private router = inject(Router);

  constructor() {
    this.checkAuth();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkAuth();
      });

    effect(() => {
      this.isLoggedIn();
    });
  }

  checkAuth() {
    const token = this.cookieService.get('token');
    if (token) {
      this.isLoggedIn.set(true);
    } else {
      this.isLoggedIn.set(false);
    }
  }

  logout() {
    this.cookieService.delete('token');
    this.isLoggedIn.set(false);
    this.router.navigate(['/auth/login']);
  }
  shouldShowNavBar(): boolean {
    const hiddenRoutes = ['/auth/login', '/auth/register'];
    return !hiddenRoutes.includes(this.router.url);
  }
}
