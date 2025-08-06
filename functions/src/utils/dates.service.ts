import * as admin from "firebase-admin";

/**
 * Formats a Firestore Timestamp into a compact string representation.
 * The output format is `YYYYMMDDHHmmss`, where:
 * - `YYYY` is the 4-digit year
 * - `MM` is the 2-digit month (01-12)
 * - `DD` is the 2-digit day (01-31)
 * - `HH` is the 2-digit hour (00-23)
 * - `mm` is the 2-digit minute (00-59)
 * - `ss` is the 2-digit second (00-59)
 * @param {admin.firestore.Timestamp} timestamp - The
 * Firestore Timestamp to format.
 * @return {string} The formatted timestamp string.
 */
export function formatTimestamp(timestamp: admin.firestore.Timestamp): string {
  const date = timestamp.toDate();
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}
