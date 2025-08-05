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
      maxLength: 100,
      pattern:
        "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
    },
  },
  required: ["email"],
  additionalProperties: false,
};

export default loginSchema;
export type {LoginInput};
