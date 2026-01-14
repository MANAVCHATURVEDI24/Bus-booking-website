import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '../service/translation.service';

@Pipe({
  name: 'translate',
  pure: false // Make it impure to react to language changes
})
export class TranslatePipe implements PipeTransform {

  constructor(private translationService: TranslationService) {}

  transform(key: string): string {
    return this.translationService.translate(key);
  }
}
