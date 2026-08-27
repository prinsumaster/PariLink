export const money = (v: unknown, cur = '₹') =>
  `${cur}${Number.isFinite(Number(v)) ? Number(v).toLocaleString('en-IN') : '0'}`;
export const num = (v: unknown) =>
  Number.isFinite(Number(v)) ? Number(v).toLocaleString('en-IN') : '0';
export const dateIN = (v: unknown) => {
  const d = v ? new Date(v as string | number | Date) : null;
  return d && !isNaN(d.getTime()) ? d.toLocaleDateString('en-IN') : '—';
};
