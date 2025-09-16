import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

@Injectable({ providedIn: 'root' })
export class PdfExportService {
  async exportElementToPdf(el: HTMLElement, filename = 'resumo.pdf') {
    // Mark element to find its counterpart in the cloned DOM
    const MARK_ATTR = 'data-pdf-capture';
    const hadMark = el.hasAttribute(MARK_ATTR);
    el.setAttribute(MARK_ATTR, '1');

    // Temporarily enforce PDF-safe (RGB/hex) styles in live DOM (fallback)
    const restore = this.applyPdfSafeStyles(el);
    try {
      // Prepare PDF
      const pdf = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Find cards
      const cards = Array.from(el.querySelectorAll<HTMLElement>('.mat-mdc-card'));
      const profissionalCard = el.querySelector('[data-pdf-order="last"].mat-mdc-card') as HTMLElement | null;
      const firstGroupCards = cards.filter((c) => c !== profissionalCard);

      // Helper to add a canvas to PDF with pagination
      const addCanvasToPdf = (canvas: HTMLCanvasElement) => {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let remaining = imgHeight;
        let position = 0;
        let firstPage = true;
        while (remaining > 0) {
          if (!firstPage) {
            pdf.addPage();
            position = 0;
          }
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
          remaining -= pageHeight;
          position -= pageHeight;
          firstPage = false;
        }
      };

      // 1) Capture Identificação + Endereço juntos usando um wrapper offscreen
      if (firstGroupCards.length) {
        const wrapper = document.createElement('div');
        wrapper.style.position = 'fixed';
        wrapper.style.left = '-10000px';
        wrapper.style.top = '0';
        wrapper.style.background = '#ffffff';
        wrapper.style.width = el.clientWidth ? `${el.clientWidth}px` : '1000px';
        firstGroupCards.forEach((c) => wrapper.appendChild(c.cloneNode(true)));
        document.body.appendChild(wrapper);

        const canvas = await html2canvas(wrapper, {
          scale: 3,
          useCORS: true,
          backgroundColor: '#ffffff',
          onclone: (doc) => {
            const clonedWrapper = doc.body.firstElementChild as HTMLElement | null;
            if (clonedWrapper) {
              this.applyPdfSafeStyles(clonedWrapper);
              clonedWrapper.style.background = '#ffffff';
              clonedWrapper.style.display = 'block';
              clonedWrapper.style.width = '100%';
            }
          },
        });

        addCanvasToPdf(canvas);
        document.body.removeChild(wrapper);
      }

      // 2) Capture Profissional como segundo bloco
      if (profissionalCard) {
        // Sempre começa em nova página
        if (pdf.getNumberOfPages() > 0) pdf.addPage();
        const canvas = await html2canvas(profissionalCard, {
          scale: 3,
          useCORS: true,
          backgroundColor: '#ffffff',
          onclone: (clonedDoc) => {
            const clonedProf = clonedDoc.querySelector('[data-pdf-order="last"].mat-mdc-card') as HTMLElement | null;
            if (clonedProf) {
              this.applyPdfSafeStyles(clonedProf);
              clonedProf.style.background = '#ffffff';
              clonedProf.style.display = 'block';
              clonedProf.style.width = '100%';
              clonedProf.style.margin = '0';
              clonedProf.style.breakInside = 'avoid';
              (clonedProf.style as any).pageBreakInside = 'avoid';
            }
          },
        });

        addCanvasToPdf(canvas);
      }

      pdf.save(filename);
    } finally {
      restore();
      if (!hadMark) el.removeAttribute(MARK_ATTR);
    }
  }

  // Applies safe inline colors to avoid unsupported color functions (like oklch) during capture.
  // Returns a function to restore the original inline styles.
  private applyPdfSafeStyles(root: HTMLElement): () => void {
    const originals = new Map<HTMLElement, Partial<CSSStyleDeclaration>>();
    const isUnsafe = (val: string | null | undefined) =>
      !!val && /(oklch|oklab|color\s*\()/i.test(val);

    const setSafe = (el: HTMLElement) => {
      const prev: Partial<CSSStyleDeclaration> = {};
      const cs = getComputedStyle(el);

      // Selectively override only when unsafe
      if (isUnsafe(cs.color)) {
        prev.color = el.style.color;
        el.style.color = '#111827';
      }
      if (isUnsafe(cs.backgroundColor) || el.classList.contains('mat-mdc-card')) {
        prev.backgroundColor = el.style.backgroundColor;
        el.style.backgroundColor = '#ffffff';
      }
      if (isUnsafe(cs.borderColor)) {
        prev.borderColor = el.style.borderColor;
        el.style.borderColor = '#e5e7eb';
      }
      if (isUnsafe(cs.boxShadow)) {
        prev.boxShadow = el.style.boxShadow;
        el.style.boxShadow = 'none';
      }
      if (isUnsafe((cs as any).outlineColor)) {
        (prev as any).outlineColor = (el.style as any).outlineColor;
        (el.style as any).outlineColor = '#111827';
      }
      if (isUnsafe((cs as any).textDecorationColor)) {
        (prev as any).textDecorationColor = (el.style as any).textDecorationColor;
        (el.style as any).textDecorationColor = '#111827';
      }
      if (isUnsafe(cs.backgroundImage)) {
        prev.backgroundImage = el.style.backgroundImage;
        el.style.backgroundImage = 'none';
      }
      if (isUnsafe((cs as any).fill)) {
        (prev as any).fill = (el.style as any).fill;
        (el.style as any).fill = '#111827';
      }
      if (isUnsafe((cs as any).stroke)) {
        (prev as any).stroke = (el.style as any).stroke;
        (el.style as any).stroke = '#111827';
      }

      // Save only if we changed anything
      if (Object.keys(prev).length) {
        originals.set(el, prev);
      }
    };

    setSafe(root);
    root.querySelectorAll<HTMLElement>('*').forEach(setSafe);

    return () => {
      originals.forEach((prev, el) => {
        if (prev.color !== undefined) el.style.color = prev.color!;
        if (prev.backgroundColor !== undefined) el.style.backgroundColor = prev.backgroundColor!;
        if (prev.borderColor !== undefined) el.style.borderColor = prev.borderColor!;
        if (prev.boxShadow !== undefined) el.style.boxShadow = prev.boxShadow!;
        if ((prev as any).outlineColor !== undefined)
          (el.style as any).outlineColor = (prev as any).outlineColor;
        if ((prev as any).textDecorationColor !== undefined)
          (el.style as any).textDecorationColor = (prev as any).textDecorationColor;
        if (prev.backgroundImage !== undefined) el.style.backgroundImage = prev.backgroundImage!;
        if ((prev as any).fill !== undefined) (el.style as any).fill = (prev as any).fill;
        if ((prev as any).stroke !== undefined) (el.style as any).stroke = (prev as any).stroke;
      });
    };
  }
}
