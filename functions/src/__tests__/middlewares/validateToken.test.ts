import {verifyAuthToken} from "../../middlewares/validateToken";
import * as tokenService from "../../utils/token.service";
import {Request, Response, NextFunction} from "express";

describe("verifyAuthToken middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return 401 if no token is provided", async () => {
    await verifyAuthToken(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({error: "Token no proporcionado"});
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if token is revoked", async () => {
    req.headers!.authorization = "Bearer fake-token";

    jest.spyOn(tokenService, "isTokenRevoked").mockResolvedValue(true);

    await verifyAuthToken(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({error: "Token revocado"});
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if token is invalid", async () => {
    req.headers!.authorization = "Bearer invalid-token";

    jest.spyOn(tokenService, "isTokenRevoked").mockResolvedValue(false);
    jest.spyOn(tokenService, "verifyToken").mockImplementation(() => {
      throw new Error("Invalid token");
    });

    await verifyAuthToken(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({error: "Token inválido o expirado"});
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next if token is valid and not revoked", async () => {
    req.headers!.authorization = "Bearer valid-token";

    jest.spyOn(tokenService, "isTokenRevoked").mockResolvedValue(false);
    jest.spyOn(tokenService, "verifyToken")
      .mockReturnValue({email: "test@example.com"});

    await verifyAuthToken(req as Request, res as Response, next);

    expect(req.headers!["x_email"]).toBe("test@example.com");
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
