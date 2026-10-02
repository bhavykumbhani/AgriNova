/**
 * Utility to mask an email address for privacy
 * Example: 'darshan@gmail.com' -> 'dar****@gmail.com'
 */
export function maskEmail(email) {
  if (!email || !email.includes('@')) return email;
  const [user, domain] = email.split('@');
  if (user.length <= 2) {
    return `${user[0]}*@${domain}`;
  }
  const prefix = user.slice(0, 3);
  return `${prefix}****@${domain}`;
}
