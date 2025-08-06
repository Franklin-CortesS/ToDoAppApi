import * as controller from "../../controllers/auth.controller";

const post = jest.fn();

jest.mock("express", () => {
  const actualExpress = jest.requireActual("express");
  return {
    ...actualExpress,
    Router: jest.fn(() => ({
      post,
    })),
  };
});

jest.mock("../../controllers/auth.controller", () => ({
  login: jest.fn(),
  logout: jest.fn(),
}));

jest.mock("../../middlewares/validateSchemas",
  () => jest.fn(() => "mockedValidateSchema"));
jest.mock("../../schemas/login.schema", () => ({}));

describe("auth.routes", () => {
  beforeAll(() => {
    require("../../routes/auth.routes");
  });

  it("should define POST /login and POST /logout with correct handlers", () => {
    expect(post).toHaveBeenCalledWith("/login", "mockedValidateSchema",
      controller.login);
    expect(post).toHaveBeenCalledWith("/logout", controller.logout);
  });
});
