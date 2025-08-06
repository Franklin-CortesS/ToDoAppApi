process.env.JWT_SECRET = "testsecret";
const addMock = jest.fn();
const getMock = jest.fn(() => Promise.resolve({empty: true}));
const limitMock = jest.fn(() => ({get: getMock}));
const whereMock = jest.fn(() => ({limit: limitMock}));
const collectionMock = jest.fn(() => ({
  add: addMock,
  where: whereMock,
}));
jest.mock("../../firebase", () => ({
  db: {
    collection: collectionMock,
  },
}));

import {
  generateToken,
  verifyToken,
  revokeToken,
  isTokenRevoked,
} from "../../utils/token.service";
import jwt from "jsonwebtoken";

describe("token service tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getMock.mockResolvedValue({empty: true});
  });

  describe("generateToken", () => {
    it("should generate a JWT token with the given email", () => {
      const email = "user@example.com";
      const token = generateToken(email);
      const payload = jwt.verify(token, process.env.JWT_SECRET!);
      expect((payload as any).email).toBe(email);
    });
  });

  describe("verifyToken", () => {
    it("should verify and decode a valid token", () => {
      const token = jwt.sign({email: "test@example.com"},
        process.env.JWT_SECRET!, {expiresIn: "10m"});
      const decoded = verifyToken(token).email;
      expect(decoded).toEqual("test@example.com");
    });

    it("should throw an error for invalid token", () => {
      expect(() => verifyToken("invalid.token")).toThrow();
    });
  });

  describe("revokeToken", () => {
    it("should add the token to the blacklist collection", async () => {
      await revokeToken("token123");
      expect(addMock).toHaveBeenCalledWith(expect.objectContaining({
        token: "token123",
      }));
    });
  });

  describe("isTokenRevoked", () => {
    it("should return false when token is not in blacklist", async () => {
      const result = await isTokenRevoked("someToken");
      expect(result).toBe(false);
    });

    it("should return true when token is in blacklist", async () => {
      getMock.mockResolvedValueOnce({empty: false});
      const result = await isTokenRevoked("revokedToken");
      expect(result).toBe(true);
    });
  });
});
