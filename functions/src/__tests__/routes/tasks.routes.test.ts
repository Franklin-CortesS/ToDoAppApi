import * as controller from "../../controllers/tasks.controller";
import {verifyAuthToken} from "../../middlewares/validateToken";

const use = jest.fn();
const get = jest.fn();
const post = jest.fn();
const put = jest.fn();
const del = jest.fn();

jest.mock("express", () => {
  const actualExpress = jest.requireActual("express");
  return {
    ...actualExpress,
    Router: jest.fn(() => ({
      use,
      get,
      post,
      put,
      delete: del,
    })),
  };
});

jest.mock("../../controllers/tasks.controller", () => ({
  getTasks: jest.fn(),
  createTask: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
}));

jest.mock("../../middlewares/validateSchemas",
  () => jest.fn(() => "mockedValidateSchema"));

jest.mock("../../middlewares/validateToken", () => ({
  verifyAuthToken: jest.fn((req, res, next) => next()),
}));

jest.mock("../../schemas/task.schema", () => ({}));

describe("task.routes", () => {
  beforeAll(() => {
    // 👇 Importar después de los mocks para que se usen correctamente
    require("../../routes/tasks.routes");
  });

  it("should define routes with correct methods and middlewares", () => {
    expect(use).toHaveBeenCalledWith(verifyAuthToken);
    expect(get).toHaveBeenCalledWith("/", controller.getTasks);
    expect(post).toHaveBeenCalledWith("/create", "mockedValidateSchema",
      controller.createTask);
    expect(put).toHaveBeenCalledWith("/update/:id", "mockedValidateSchema",
      controller.updateTask);
    expect(del).toHaveBeenCalledWith("/delete/:id", controller.deleteTask);
  });
});
