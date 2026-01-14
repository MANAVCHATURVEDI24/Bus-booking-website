import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Language {
  code: string;
  name: string;
  flag: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguageSubject = new BehaviorSubject<string>('en');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  private readonly LANGUAGE_KEY = 'selected-language';

  public readonly supportedLanguages: Language[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' }
  ];

  constructor() {
    this.loadSavedLanguage();
  }

  private loadSavedLanguage(): void {
    const savedLanguage = localStorage.getItem(this.LANGUAGE_KEY);
    if (savedLanguage && this.isLanguageSupported(savedLanguage)) {
      this.currentLanguageSubject.next(savedLanguage);
    }
  }

  getCurrentLanguage(): string {
    return this.currentLanguageSubject.value;
  }

  setLanguage(languageCode: string): void {
    if (this.isLanguageSupported(languageCode)) {
      this.currentLanguageSubject.next(languageCode);
      localStorage.setItem(this.LANGUAGE_KEY, languageCode);
      console.log('Language changed to:', languageCode);
    }
  }

  private isLanguageSupported(languageCode: string): boolean {
    return this.supportedLanguages.some(lang => lang.code === languageCode);
  }

  getLanguageName(code: string): string {
    const language = this.supportedLanguages.find(lang => lang.code === code);
    return language ? language.name : code;
  }

  getLanguageFlag(code: string): string {
    const language = this.supportedLanguages.find(lang => lang.code === code);
    return language ? language.flag : '🌐';
  }
}