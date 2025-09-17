export function formatPhone(value: string): string {
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
  const p1 = rest.slice(0, 5);
  const p2 = rest.slice(5, 9);
  const p3 = rest.slice(9);
  return `(${ddd}) ${p1}${p2 ? '-' + p2 : ''}${p3}`;
}

export function formatCpf(value: string): string {
  const digits = (value || '').replace(/\D/g, '').slice(0, 11);
  const p1 = digits.slice(0, 3);
  const p2 = digits.slice(3, 6);
  const p3 = digits.slice(6, 9);
  const p4 = digits.slice(9, 11);
  let out = p1;
  if (p2) out += `.${p2}`;
  if (p3) out += `.${p3}`;
  if (p4) out += `-${p4}`;
  return out;
}

export function maskDateDDMMYYYY(raw: string): string {
  const digits = (raw || '').replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return digits.slice(0, 2) + '/' + digits.slice(2);
  return digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/' + digits.slice(4);
}
