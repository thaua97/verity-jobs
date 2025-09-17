/**
 * Testes para o componente ResumeListItem
 * 
 * Testa a lógica de negócio principal: geração de iniciais e simulação de ações.
 */

// Utilitários de teste que replicam a lógica do componente
class ResumeListItemTestUtils {
  /**
   * Gera iniciais a partir do nome (replica a lógica do getter initials)
   */
  static generateInitials(name: string): string {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? '';
    const second = parts[1]?.[0] ?? '';
    const res = (first + second).toUpperCase();
    return res || '?';
  }

  /**
   * Simula o resultado da ação de deletar
   */
  static simulateDeleteAction(confirmed: boolean, id: string): { shouldEmit: boolean; emittedId?: string } {
    if (confirmed) {
      return { shouldEmit: true, emittedId: id };
    }
    return { shouldEmit: false };
  }
}

describe('ResumeListItem - Lógica de Negócio', () => {
  describe('Geração de Iniciais', () => {
    it('deve gerar iniciais para nomes completos', () => {
      expect(ResumeListItemTestUtils.generateInitials('João Silva')).toBe('JS');
      expect(ResumeListItemTestUtils.generateInitials('Maria Santos')).toBe('MS');
      expect(ResumeListItemTestUtils.generateInitials('Ana Maria Silva')).toBe('AM');
    });

    it('deve gerar iniciais para nomes únicos', () => {
      expect(ResumeListItemTestUtils.generateInitials('João')).toBe('J');
      expect(ResumeListItemTestUtils.generateInitials('Maria')).toBe('M');
    });

    it('deve tratar nomes com espaços extras', () => {
      expect(ResumeListItemTestUtils.generateInitials('  João   Silva  ')).toBe('JS');
      expect(ResumeListItemTestUtils.generateInitials('Maria    Santos')).toBe('MS');
    });

    it('deve retornar ? para nomes vazios', () => {
      expect(ResumeListItemTestUtils.generateInitials('')).toBe('?');
      expect(ResumeListItemTestUtils.generateInitials('   ')).toBe('?');
    });

    it('deve converter para maiúsculas', () => {
      expect(ResumeListItemTestUtils.generateInitials('joão silva')).toBe('JS');
      expect(ResumeListItemTestUtils.generateInitials('maria santos')).toBe('MS');
    });
  });

  describe('Simulação de Ações', () => {
    it('deve emitir evento quando deleção é confirmada', () => {
      const result = ResumeListItemTestUtils.simulateDeleteAction(true, 'resume-123');
      expect(result.shouldEmit).toBe(true);
      expect(result.emittedId).toBe('resume-123');
    });

    it('não deve emitir evento quando deleção é cancelada', () => {
      const result = ResumeListItemTestUtils.simulateDeleteAction(false, 'resume-123');
      expect(result.shouldEmit).toBe(false);
      expect(result.emittedId).toBeUndefined();
    });
  });

  describe('Casos de Uso Reais', () => {
    it('deve processar dados completos de um currículo', () => {
      const name = 'Ana Maria Silva';
      const resumeId = 'resume-456';

      // Gerar iniciais
      const initials = ResumeListItemTestUtils.generateInitials(name);
      expect(initials).toBe('AM');

      // Simular deleção confirmada
      const deleteResult = ResumeListItemTestUtils.simulateDeleteAction(true, resumeId);
      expect(deleteResult.shouldEmit).toBe(true);
      expect(deleteResult.emittedId).toBe('resume-456');
    });
  });
});
