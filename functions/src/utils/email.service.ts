/**
 * Extracts the username part from an email address.
 * The username is defined as the substring before the '@' symbol,
 * with all non-alphanumeric characters removed.
 * @param {string} email - The email address to extract the username from.
 * @return {string} The sanitized username consisting of only alphanumeric
 * characters.
 */
export function getUsernameFromEmail(email: string): string {
  let username = email.split("@")[0];
  username= username.replace(/[^a-zA-Z0-9]/g, "");
  return username;
}
