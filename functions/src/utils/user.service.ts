import {db} from "../firebase";
import {getUsernameFromEmail} from "./email.service";

/**
 * Checks if a user document exists in the Firestore database
 * for the given email.
 * @param {string} email - The email address of the user to
 * check for existence.
 * @return {Promise<boolean>} A promise that resolves to `true`
 * if the user exists, or `false` otherwise.
 */
export async function userExists(email: string): Promise<boolean> {
  const docRef = db.collection("users").doc(email);
  const docSnap = await docRef.get();
  return docSnap.exists;
}

/**
 * Saves a user to the Firestore database withthe specified email.
 * If the user does not exist, a new document is created with the
 * email and the current timestamp.
 * @param {string} email - The email address of the user to save.
 * @return {Promise<void>} A promise that resolves when the user
 * has been saved.
 */
export async function saveUser(email: string): Promise<void> {
  const docRef = db.collection("users").doc(email);
  const username = getUsernameFromEmail(email);
  await docRef.set({
    email,
    username,
    createdAt: new Date(),
  });
}
