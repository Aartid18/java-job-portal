export type Strength = 'Weak' | 'Fair' | 'Strong' | 'Very Strong';

export function scorePassword(password: string): { score: number; label: Strength; hints: string[] } {
  const hints: string[] = [];
  let score = 0;

  if (password.length >= 8) score += 1;
  else hints.push('At least 8 characters');

  if (/[a-z]/.test(password)) score += 1;
  else hints.push('Add a lowercase letter');

  if (/[A-Z]/.test(password)) score += 1;
  else hints.push('Add an uppercase letter');

  if (/\d/.test(password)) score += 1;
  else hints.push('Add a number');

  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  else hints.push('Add a special character');

  if (password.length >= 12) score += 1;

  let label: Strength = 'Weak';
  if (score >= 6) label = 'Very Strong';
  else if (score >= 5) label = 'Strong';
  else if (score >= 3) label = 'Fair';

  return { score, label, hints };
}

export function isPasswordValid(password: string) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(password);
}
