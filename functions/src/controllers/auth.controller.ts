import {Request, Response} from "express";
import {generateToken, revokeToken} from "../utils/token.service";
import {userExists, saveUser} from "../utils/user.service";

/**
 * Handles user login by validating the email and
 * generating an authentication token.
 * @param {Request} req - Express request object
 * containing the users email in the body.
 * @param {Response} res - Express response object
 * used to send the authentication token or error message.
 * @return {Object} Returns a JSON response with
 * the authentication token if the email is valid,
 * otherwise returns a 400 error with an appropriate message.
 */
export async function login(req: Request, res: Response) {
  const {email} = req.body;

  const exists = await userExists(email);

  if (!exists) {
    await saveUser(email);
  }

  const token = generateToken(email);
  return res.status(200).json({token, exists});
}

/**
 * Handles user logout by revoking the provided JWT token.
 * @param {Request} req - Express request object containing
 * the authorization header.
 * @param {Response} res - Express response object used to
 * send the result.
 * @return {Object} A JSON response indicating whether the
 * token was successfully revoked or an error if the
 * token was not provided.
 */
export async function logout(req: Request, res: Response) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(400).json({error: "Token no proporcionado"});
  }

  const token = authHeader.split(" ")[1];
  await revokeToken(token);
  return res.json({message: "Token revocado exitosamente"});
}
