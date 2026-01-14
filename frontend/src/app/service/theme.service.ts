import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkModeSubject = new BehaviorSubject<boolean>(false);
  public isDarkMode$ = this.isDarkModeSubject.asObservable();

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme(): void {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem('theme-preference');
    
    if (savedTheme) {
      // Use saved preference
      const isDark = savedTheme === 'dark';
      this.setTheme(isDark);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark);
    }
  }

  toggleTheme(): void {
    const currentTheme = this.isDarkModeSubject.value;
    this.setTheme(!currentTheme);
  }

  setTheme(isDark: boolean): void {
    this.isDarkModeSubject.next(isDark);
    
    // Save preference to localStorage
    localStorage.setItem('theme-preference', isDark ? 'dark' : 'light');
    
    // Remove existing theme classes
    document.body.classList.remove('dark-theme', 'light-theme');
    
    // Apply theme to document
    if (isDark) {
      document.body.classList.add('dark-theme');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.body.classList.add('light-theme');
      document.documentElement.style.colorScheme = 'light';
    }
    
    // Force a repaint to ensure styles are applied
    setTimeout(() => {
      document.body.style.display = 'none';
      document.body.offsetHeight; // Trigger reflow
      document.body.style.display = '';
    }, 10);
  }

  getCurrentTheme(): boolean {
    return this.isDarkModeSubject.value;
  }
}