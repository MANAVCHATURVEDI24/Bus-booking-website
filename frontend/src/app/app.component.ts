import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ThemeService } from './service/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'frontend';
  isAppReady = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Initialize theme service (it will automatically apply saved theme)
    // Mark app as ready immediately
    this.isAppReady = true;
  }

  ngAfterViewInit(): void {
    // Ensure app content is visible
    setTimeout(() => {
      const appRoot = document.querySelector('app-root');
      if (appRoot) {
        (appRoot as HTMLElement).style.opacity = '1';
        (appRoot as HTMLElement).style.visibility = 'visible';
      }
    }, 50);
  }

  ngOnDestroy(): void {
    // No subscriptions to unsubscribe
  }
}