import {Request, Response, NextFunction} from "express";
import Ajv, {JSONSchemaType} from "ajv";

const ajv = new Ajv();

/**
 * Validates the schema of the given object.
 * @template T
 * @param {JSONSchemaType<T>} schema - The JSON schema to validate.
 * @return {boolean} - Returns true if the schema is valid, otherwise false.
 */
export default function validateSchema<T>(schema: JSONSchemaType<T>) {
  const validate = ajv.compile(schema);

  return (req: Request, res: Response, next: NextFunction) => {
    if (!validate(req.body)) {
      return res.status(400).json({
        error: "Datos inválidos",
        detalles: validate.errors,
      });
    }
    return next();
  };
}
