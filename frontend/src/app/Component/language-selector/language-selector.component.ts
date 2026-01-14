import { Component, OnInit } from '@angular/core';
import { LanguageService, Language } from '../../service/language.service';
import { TranslationService } from '../../service/translation.service';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.css']
})
export class LanguageSelectorComponent implements OnInit {
  currentLanguage: string = 'en';
  supportedLanguages: Language[] = [];
  isDropdownOpen: boolean = false;

  constructor(
    private languageService: LanguageService,
    private translationService: TranslationService
  ) {
    console.log('LanguageSelectorComponent constructor called');
  }

  ngOnInit(): void {
    console.log('LanguageSelectorComponent ngOnInit called');
    this.supportedLanguages = this.languageService.supportedLanguages;
    console.log('Supported languages:', this.supportedLanguages);
    
    this.languageService.currentLanguage$.subscribe(language => {
      this.currentLanguage = language;
      console.log('Current language changed to:', language);
    });
    
    // Force initial display
    setTimeout(() => {
      console.log('Language selector should be visible now');
    }, 100);
  }

  toggleDropdown(): void {
    console.log('Toggle dropdown clicked, current state:', this.isDropdownOpen);
    this.isDropdownOpen = !this.isDropdownOpen;
    console.log('New dropdown state:', this.isDropdownOpen);
  }

  selectLanguage(languageCode: string): void {
    console.log('Language selected:', languageCode);
    this.languageService.setLanguage(languageCode);
    this.isDropdownOpen = false;
    
    // Show confirmation and reload page to apply translations
    alert(`Language changed to ${this.languageService.getLanguageName(languageCode)}!\n\nThe page will reload to apply all translations.`);
    
    // Reload the page after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }

  getCurrentLanguageFlag(): string {
    const flag = this.languageService.getLanguageFlag(this.currentLanguage);
    console.log('Current language flag:', flag);
    return flag;
  }

  getCurrentLanguageName(): string {
    const name = this.languageService.getLanguageName(this.currentLanguage);
    console.log('Current language name:', name);
    return name;
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }
}
