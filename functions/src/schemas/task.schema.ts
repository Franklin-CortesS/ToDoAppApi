import {JSONSchemaType} from "ajv";

interface TaskInput {
  title: string;
  description: string;
  completed: boolean;
}

const taskSchema: JSONSchemaType<TaskInput> = {
  type: "object",
  properties: {
    title: {type: "string", minLength: 1, maxLength: 35},
    description: {type: "string", minLength: 1, maxLength: 100},
    completed: {type: "boolean"},
  },
  required: ["title", "description", "completed"],
  additionalProperties: false,
};

export default taskSchema;
export type {TaskInput};
