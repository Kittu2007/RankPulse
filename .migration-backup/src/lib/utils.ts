type ClassDictionary = Record<string, boolean | null | undefined>;
type ClassInput =
  | string
  | number
  | null
  | undefined
  | false
  | ClassDictionary
  | ClassInput[];

function normalizeClass(input: ClassInput): string[] {
  if (!input) {
    return [];
  }

  if (typeof input === "string" || typeof input === "number") {
    return [String(input)];
  }

  if (Array.isArray(input)) {
    return input.flatMap(normalizeClass);
  }

  return Object.entries(input)
    .filter(([, value]) => Boolean(value))
    .map(([key]) => key);
}

export function cn(...inputs: ClassInput[]): string {
  return inputs.flatMap(normalizeClass).join(" ");
}

export function formatNumber(
  number: number | string,
  options: Intl.NumberFormatOptions = {}
): string {
  const numericValue = typeof number === 'string' ? parseFloat(number) : number;
  if (isNaN(numericValue)) {
    return "0";
  }

  const {
    notation = 'compact',
    maximumFractionDigits = 1,
    ...rest
  } = options;

  return new Intl.NumberFormat('en-US', {
    notation,
    maximumFractionDigits,
    ...rest,
  }).format(numericValue);
}

export function clampScore(score: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(score)));
}
