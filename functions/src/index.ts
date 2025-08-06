import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/v2/https";
import {defineSecret} from "firebase-functions/params";
import app from "./app";

setGlobalOptions({maxInstances: 10});
const jwtSecret = defineSecret("JWT_SECRET");

export const api = onRequest({secrets: [jwtSecret]}, app);
