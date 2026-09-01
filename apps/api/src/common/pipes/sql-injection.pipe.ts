import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { validateGeneratedSql } from '../../ai/copilot/sql-validator';

@Injectable()
export class SqlInjectionPipe implements PipeTransform {
  transform(value: any) {
    let intentStr = '';
    if (typeof value === 'string') {
      intentStr = value;
    } else if (typeof value === 'object' && value !== null && value.intent) {
      intentStr = value.intent;
    }
    
    if (intentStr && intentStr.toUpperCase().includes('SELECT ')) {
      // If the intent happens to be a direct SELECT query injection attempt, validate it structurally.
      // We pass some mock allowedTables just to not crash, though if it's an injection it'll fail other rules.
      const res = validateGeneratedSql(intentStr, ['Trip', 'Load', 'Vehicle', 'FuelEntry', 'Expense', 'Invoice', 'Driver', 'Customer']);
      if (!res.ok) {
        throw new BadRequestException('Potential SQL Injection detected: ' + res.reason);
      }
    }
    return value;
  }
}
