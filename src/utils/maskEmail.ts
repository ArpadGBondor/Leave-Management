export function maskEmail(email: string): string {
  if (!email || typeof email !== 'string') return String(email);

  const atIndex = email.indexOf('@');
  if (atIndex === -1) return email; // not an email-like string

  const local = email.slice(0, atIndex).trim();
  const domain = email.slice(atIndex + 1);
  if (!domain) return email;

  const len = local.length;
  if (len === 0) return email;
  if (len === 1) return `${local[0]}**@${domain}`;
  if (len === 2) return `${local[0]}**${local[1]}@${domain}`;
  return `${local[0]}**${local[len - 1]}@${domain}`;
}
