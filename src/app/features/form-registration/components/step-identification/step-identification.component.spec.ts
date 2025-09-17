class StepIdentificationTestUtils {
  static dateValidator(minAgeYears: number = 14) {
    return (control: any) => {
      const value = control.value;
      if (!value) return null;

      const date = value instanceof Date ? value : new Date(value);
      if (isNaN(date.getTime())) return { dateInvalid: true };

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);

      if (d > today) return { dateInFuture: true };

      const minAgeDate = new Date(today);
      minAgeDate.setFullYear(today.getFullYear() - minAgeYears);
      if (d > minAgeDate) return { minAge: { requiredAge: minAgeYears } };

      return null;
    };
  }

  static phoneValidator() {
    const digitsOnly = /\D/g;
    return (control: any) => {
      const value: string = control.value ?? '';
      const numeric = value.replace(digitsOnly, '');

      if (numeric.length === 0) return null;
      if (numeric.length < 10 || numeric.length > 11) return { phoneLength: true };

      return null;
    };
  }

  static cpfValidator() {
    return (control: any) => {
      let value: string = control.value ?? '';
      value = value.replace(/\D/g, '');

      if (!value) return null;
      if (value.length !== 11) return { cpfLength: true };
      if (/^(\d)\1{10}$/.test(value)) return { cpfInvalid: true };

      // Cálculo dos dígitos verificadores
      const calcCheck = (base: string): number => {
        const digits = base.split('').map(Number);
        const factorStart = base.length + 1;
        const total = digits.reduce((sum, d, i) => sum + d * (factorStart - i), 0);
        const mod = (total * 10) % 11;
        return mod === 10 ? 0 : mod;
      };

      const d1 = calcCheck(value.substring(0, 9));
      const d2 = calcCheck(value.substring(0, 10));

      if (d1 !== Number(value[9]) || d2 !== Number(value[10])) {
        return { cpfInvalid: true };
      }

      return null;
    };
  }


  static formatPhone(value: string): string {
    const digits = (value || '').replace(/\D/g, '').slice(0, 11);
    const ddd = digits.slice(0, 2);
    const rest = digits.slice(2);

    if (!ddd) return digits;
    if (rest.length <= 4) return `(${ddd}) ${rest}`.trim();
    if (rest.length === 5) return `(${ddd}) ${rest}`;

    if (rest.length <= 9) {
      const p1 = rest.slice(0, rest.length - 4);
      const p2 = rest.slice(-4);
      return `(${ddd}) ${p1}-${p2}`;
    }

    // Para 11 dígitos: (11) 99999-9999
    const p1 = rest.slice(0, 5);
    const p2 = rest.slice(5, 9);
    const p3 = rest.slice(9);
    return `(${ddd}) ${p1}${p2 ? '-' + p2 : ''}${p3}`;
  }

  /**
   * Formatador de CPF que aplica máscara progressiva:
   * - 999.999.999-99
   */
  static formatCpf(value: string): string {
    const digits = (value || '').replace(/\D/g, '').slice(0, 11);
    const p1 = digits.slice(0, 3);   // primeiros 3 dígitos
    const p2 = digits.slice(3, 6);   // próximos 3 dígitos
    const p3 = digits.slice(6, 9);   // próximos 3 dígitos
    const p4 = digits.slice(9, 11);  // últimos 2 dígitos

    let out = p1;
    if (p2) out += `.${p2}`;
    if (p3) out += `.${p3}`;
    if (p4) out += `-${p4}`;

    return out;
  }
}

describe('StepIdentification - Lógica de Negócio', () => {
  describe('Validadores', () => {
    describe('dateValidator - Validação de Data', () => {
      const createControl = (value: any) => ({ value });

      describe('Casos de erro', () => {
        it('deve rejeitar datas futuras', () => {
          const validator = StepIdentificationTestUtils.dateValidator();
          const future = new Date();
          future.setFullYear(future.getFullYear() + 1);
          
          const result = validator(createControl(future));
          
          expect(result).toEqual({ dateInFuture: true });
        });

        it('deve rejeitar idades menores que o mínimo', () => {
          const validator = StepIdentificationTestUtils.dateValidator(18);
          const today = new Date();
          const tooYoung = new Date();
          tooYoung.setFullYear(today.getFullYear() - 10); // 10 anos
          
          const result = validator(createControl(tooYoung));
          
          expect(result).toEqual({ minAge: { requiredAge: 18 } });
        });

        it('deve rejeitar datas inválidas', () => {
          const validator = StepIdentificationTestUtils.dateValidator();
          
          const result = validator(createControl(new Date('invalid')));
          
          expect(result).toEqual({ dateInvalid: true });
        });
      });

      describe('Casos de sucesso', () => {
        it('deve aceitar datas passadas válidas', () => {
          const validator = StepIdentificationTestUtils.dateValidator();
          const valid = new Date();
          valid.setFullYear(valid.getFullYear() - 30); // 30 anos atrás
          
          const result = validator(createControl(valid));
          
          expect(result).toBeNull();
        });

        it('deve aceitar valores vazios', () => {
          const validator = StepIdentificationTestUtils.dateValidator();
          
          expect(validator(createControl(null))).toBeNull();
          expect(validator(createControl(''))).toBeNull();
          expect(validator(createControl(undefined))).toBeNull();
        });
      });
    });

    describe('phoneValidator - Validação de Telefone', () => {
      const createControl = (value: any) => ({ value });
      const validator = StepIdentificationTestUtils.phoneValidator();

      describe('Casos de erro', () => {
        it('deve rejeitar números com menos de 10 dígitos', () => {
          const result = validator(createControl('111111111')); // 9 dígitos
          expect(result).toEqual({ phoneLength: true });
        });

        it('deve rejeitar números com mais de 11 dígitos', () => {
          const result = validator(createControl('119876543211')); // 12 dígitos
          expect(result).toEqual({ phoneLength: true });
        });
      });

      describe('Casos de sucesso', () => {
        it('deve aceitar telefones fixos (10 dígitos)', () => {
          const result = validator(createControl('1198765432'));
          expect(result).toBeNull();
        });

        it('deve aceitar celulares (11 dígitos)', () => {
          const result = validator(createControl('11987654321'));
          expect(result).toBeNull();
        });

        it('deve aceitar valores vazios', () => {
          expect(validator(createControl(''))).toBeNull();
          expect(validator(createControl(null))).toBeNull();
        });

        it('deve ignorar caracteres não numéricos', () => {
          expect(validator(createControl('(11) 98765-4321'))).toBeNull(); // 11 dígitos
          expect(validator(createControl('(11) 9876-5432'))).toBeNull();  // 10 dígitos
        });
      });
    });

    describe('cpfValidator - Validação de CPF', () => {
      const createControl = (value: any) => ({ value });
      const validator = StepIdentificationTestUtils.cpfValidator();

      describe('Casos de erro', () => {
        it('deve rejeitar CPFs com comprimento incorreto', () => {
          expect(validator(createControl('123'))).toEqual({ cpfLength: true });
          expect(validator(createControl('123456789'))).toEqual({ cpfLength: true });
        });

        it('deve rejeitar sequências repetidas', () => {
          const result = validator(createControl('111.111.111-11'));
          expect(result).toEqual({ cpfInvalid: true });
        });

        it('deve rejeitar CPFs com dígitos verificadores inválidos', () => {
          const result = validator(createControl('12345678901'));
          expect(result).toEqual({ cpfInvalid: true });
        });
      });

      describe('Casos de sucesso', () => {
        it('deve aceitar CPFs válidos com formatação', () => {
          const result = validator(createControl('529.982.247-25'));
          expect(result).toBeNull();
        });

        it('deve aceitar CPFs válidos sem formatação', () => {
          const result = validator(createControl('52998224725'));
          expect(result).toBeNull();
        });

        it('deve aceitar valores vazios', () => {
          expect(validator(createControl(''))).toBeNull();
          expect(validator(createControl(null))).toBeNull();
        });
      });
    });
  });

  describe('Formatadores', () => {
    describe('formatPhone - Formatação de Telefone', () => {
      const { formatPhone } = StepIdentificationTestUtils;

      describe('Formatação progressiva', () => {
        it('deve formatar conforme o usuário digita', () => {
          expect(formatPhone('')).toBe('');
          expect(formatPhone('1')).toBe('(1)');
          expect(formatPhone('11')).toBe('(11)');
          expect(formatPhone('119')).toBe('(11) 9');
          expect(formatPhone('1198765')).toBe('(11) 98765');
        });

        it('deve aplicar máscara completa para telefones fixos (10 dígitos)', () => {
          const result = formatPhone('1198765432');
          expect(result).toBe('(11) 9876-5432');
        });

        it('deve aplicar máscara completa para celulares (11 dígitos)', () => {
          const result = formatPhone('11987654321');
          expect(result).toBe('(11) 98765-4321');
        });
      });

      describe('Limitações', () => {
        it('deve limitar a 11 dígitos', () => {
          const result = formatPhone('119876543211234'); // 15 dígitos
          expect(result).toBe('(11) 98765-4321');
        });
      });
    });

    describe('formatCpf - Formatação de CPF', () => {
      const { formatCpf } = StepIdentificationTestUtils;

      describe('Formatação progressiva', () => {
        it('deve formatar conforme o usuário digita', () => {
          expect(formatCpf('')).toBe('');
          expect(formatCpf('5')).toBe('5');
          expect(formatCpf('529')).toBe('529');
          expect(formatCpf('52998')).toBe('529.98');
          expect(formatCpf('529982')).toBe('529.982');
          expect(formatCpf('529982247')).toBe('529.982.247');
        });

        it('deve aplicar máscara completa (999.999.999-99)', () => {
          const result = formatCpf('52998224725');
          expect(result).toBe('529.982.247-25');
        });
      });

      describe('Limitações', () => {
        it('deve limitar a 11 dígitos', () => {
          const result = formatCpf('529982247251234'); // 15 dígitos
          expect(result).toBe('529.982.247-25');
        });
      });
    });
  });
});
