import { Injectable, Logger } from '@nestjs/common';
import * as Handlebars from 'handlebars';

@Injectable()
export class TemplateService {
  private readonly logger = new Logger(TemplateService.name);

  constructor() {
    // Register some generic helpers
    Handlebars.registerHelper('uppercase', (str) => {
      return str && typeof str === 'string' ? str.toUpperCase() : '';
    });
    Handlebars.registerHelper('formatDate', (date) => {
      return new Date(date).toLocaleDateString();
    });
  }

  render(templateString: string, data: any): string {
    try {
      const compiledTemplate = Handlebars.compile(templateString);
      return compiledTemplate(data);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      this.logger.error(`Template rendering failed: ${errorMessage}`);
      return templateString; // Fallback to raw string
    }
  }
}
