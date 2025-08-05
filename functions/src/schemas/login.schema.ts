import {JSONSchemaType} from "ajv";

interface LoginInput {
  email: string;
}

const loginSchema: JSONSchemaType<LoginInput> = {
  type: "object",
  properties: {
    email: {
      type: "string",
      format: "email",
      minLength: 5,
      maxLength: 100
    },
  },
  required: ["email"],
  additionalProperties: false,
};

export default loginSchema;
export type {LoginInput};
