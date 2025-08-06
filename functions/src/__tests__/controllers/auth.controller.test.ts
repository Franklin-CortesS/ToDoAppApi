import {login, logout} from "../../controllers/auth.controller";
import * as tokenService from "../../utils/token.service";
import * as userService from "../../utils/user.service";
import {Request, Response} from "express";

describe("Auth Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: {},
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("should return token and exists = true if" +
      "user already exists", async () => {
      req.body = {email: "test@example.com"};

      jest.spyOn(userService, "userExists").mockResolvedValue(true);
      jest.spyOn(tokenService, "generateToken").mockReturnValue("fake-token");

      await login(req as Request, res as Response);

      expect(userService.userExists)
        .toHaveBeenCalledWith("test@example.com");
      expect(tokenService.generateToken)
        .toHaveBeenCalledWith("test@example.com");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json)
        .toHaveBeenCalledWith({token: "fake-token", exists: true});
    });

    it("should save user and return token with exists = false" +
      "if user does not exist", async () => {
      req.body = {email: "new@example.com"};

      jest.spyOn(userService, "userExists").mockResolvedValue(false);
      jest.spyOn(userService, "saveUser").mockResolvedValue(undefined);
      jest.spyOn(tokenService, "generateToken").mockReturnValue("new-token");

      await login(req as Request, res as Response);

      expect(userService.saveUser)
        .toHaveBeenCalledWith("new@example.com");
      expect(tokenService.generateToken)
        .toHaveBeenCalledWith("new@example.com");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        token: "new-token",
        exists: false,
      });
    });
  });

  describe("logout", () => {
    it("should return 400 if no token is provided", async () => {
      req.headers = {};

      await logout(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({error: "Token no proporcionado"});
    });

    it("should revoke token and return 200 message", async () => {
      req.headers = {authorization: "Bearer valid-token"};

      jest.spyOn(tokenService, "revokeToken").mockResolvedValue(undefined);

      await logout(req as Request, res as Response);

      expect(tokenService.revokeToken).toHaveBeenCalledWith("valid-token");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Token revocado exitosamente",
      });
    });
  });
});
