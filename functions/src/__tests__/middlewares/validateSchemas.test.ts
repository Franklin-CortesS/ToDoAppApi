import validateSchema from "../../middlewares/validateSchemas";
import {Request, Response, NextFunction} from "express";
import {JSONSchemaType} from "ajv";

interface MockData {
  name: string;
  age: number;
}

const schema: JSONSchemaType<MockData> = {
  type: "object",
  properties: {
    name: {type: "string"},
    age: {type: "integer", minimum: 0},
  },
  required: ["name", "age"],
  additionalProperties: false,
};

describe("validateSchema middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should call next() when data is valid", () => {
    req.body = {name: "Alice", age: 30};

    const middleware = validateSchema(schema);
    middleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should respond with 400 when data is invalid", () => {
    req.body = {name: "Alice", age: -5};

    const middleware = validateSchema(schema);
    middleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      error: "Datos inválidos",
      detalles: expect.any(Array),
    }));
    expect(next).not.toHaveBeenCalled();
  });

  it("should respond with 400 when missing required fields", () => {
    req.body = {name: "Alice"};

    const middleware = validateSchema(schema);
    middleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      error: "Datos inválidos",
      detalles: expect.any(Array),
    }));
    expect(next).not.toHaveBeenCalled();
  });
});
