/** Combina clases de Tailwind de forma limpia (similar a clsx) */
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
