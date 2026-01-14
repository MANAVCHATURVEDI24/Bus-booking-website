import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { LanguageService } from '../../service/language.service';
import { TranslationService } from '../../service/translation.service';

declare global {
  interface Window {
    changeLanguageNow: (languageCode: string) => void;
  }
}

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
  encapsulation: ViewEncapsulation.None
})
export class LandingPageComponent implements OnInit {
  fromoption: string = ''
  tooption: string = ''
  date: string = ''
  heroTitle: string = '';
  
  constructor(
    private router: Router, 
    public dialog: MatDialog,
    private languageService: LanguageService,
    private translationService: TranslationService
  ) { }

  ngOnInit() {
    // Load the current language and apply translations
    const currentLanguage = this.languageService.getCurrentLanguage();
    this.updateTranslations(currentLanguage);
    
    // Subscribe to language changes
    this.languageService.currentLanguage$.subscribe(language => {
      this.updateTranslations(language);
    });
    
    // Make the function globally available
    window.changeLanguageNow = this.changeLanguageNow.bind(this);
  }

  updateTranslations(language: string) {
    this.heroTitle = this.translationService.translate('landing.heroTitle');
    
    // Also update the DOM element directly for the inline script
    setTimeout(() => {
      const heroTitleElement = document.getElementById('heroTitle');
      if (heroTitleElement) {
        heroTitleElement.textContent = this.heroTitle;
      }
    }, 0);
  }

  changeLanguageNow(languageCode: string) {
    console.log('LANGUAGE CHANGED TO:', languageCode);
    
    // Save language preference
    localStorage.setItem('selected-language', languageCode);
    
    // Update language service
    this.languageService.setLanguage(languageCode);
    
    // Update translations immediately
    this.updateTranslations(languageCode);
    
    // Show confirmation
    alert(`Language changed to: ${languageCode.toUpperCase()}\nPage will reload to apply all changes.`);
    
    // Reload page to apply language changes
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }

  fromEvent(option: string) {
    this.fromoption = option;
    console.log(this.fromoption)
  }
  toEvent(option: string) {
    this.tooption = option;
  }
  matchDate(event: any) {
    if (event.value) {
      const date = new Date(event.value);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear().toString();
      this.date = `${year}-${month}-${day}`;
    } else {
      this.date = 'null';
    }
    console.log(this.date)
  }
  submit() {
    if (this.fromoption && this.tooption && this.date) {
      if (this.fromoption === 'Delhi' && this.tooption === 'Jaipur' || this.fromoption === 'Mumbai' && this.tooption === 'Goa' || this.fromoption === 'Bangalore' && this.tooption === 'Mysore' || this.fromoption === 'Kolkata' && this.tooption === 'Darjeeling' || this.fromoption === 'Chennai' && this.tooption === 'Pondicherry') {
        this.router.navigate(['/select-bus'],{
          queryParams:{
            departure:this.fromoption,
            arrival:this.tooption,
            date:this.date
          }
        });
      } else {
        const dialogRef = this.dialog.open(DialogComponent);

        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
      }
    } else {
      alert("fill up the details!!!")
    }
  }

  navigateToRoutePlanner() {
    this.router.navigate(['/route-planner']);
  }
}
