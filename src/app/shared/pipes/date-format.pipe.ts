import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (!value) return '---';
    
    let date: Date;
    
    // Se for string no formato DD/MM/AAAA, converter para Date
    if (typeof value === 'string') {
      if (value.includes('/')) {
        const [day, month, year] = value.split('/');
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      } else {
        date = new Date(value);
      }
    } else {
      date = new Date(value);
    }
    
    // Verificar se a data é válida
    if (isNaN(date.getTime())) {
      return '---';
    }
    
    // Formatar no padrão brasileiro DD/MM/AAAA
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  }
}
