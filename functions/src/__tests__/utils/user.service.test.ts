import {userExists, saveUser} from "../../utils/user.service";
import {db} from "../../firebase";
import admin from "firebase-admin";
import {getUsernameFromEmail} from "../../utils/email.service";

jest.mock("../../firebase", () => {
  const getMock = jest.fn(() => Promise.resolve({empty: true}));
  const limitMock = jest.fn(() => ({get: getMock}));
  const whereMock = jest.fn(() => ({limit: limitMock}));
  const addMock = jest.fn();

  return {
    db: {
      collection: jest.fn(() => ({
        where: whereMock,
        limit: limitMock,
        get: getMock,
        add: addMock,
      })),
    },
  };
});

jest.mock("../../utils/email.service", () => ({
  getUsernameFromEmail: jest.fn((email: string) => "mockedusername"),
}));

describe("user service tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("userExists", () => {
    it("should return true if user exists", async () => {
      (db.collection("users").get as jest.Mock)
        .mockResolvedValueOnce({empty: false});

      const result = await userExists("user@example.com");
      expect(result).toBe(true);

      expect(db.collection).toHaveBeenCalledWith("users");
      expect(db.collection("users").where)
        .toHaveBeenCalledWith("email", "==", "user@example.com");
    });

    it("should return false if user does not exist", async () => {
      const result = await userExists("nonexistent@example.com");
      expect(result).toBe(false);
    });
  });

  describe("saveUser", () => {
    it("should save user with correct data", async () => {
      const email = "save@example.com";
      const mockTimestamp = {seconds: 1234567890, nanoseconds: 0};
      const addMock = db.collection("users").add as jest.Mock;
      jest.spyOn(admin.firestore.Timestamp, "now")
        .mockReturnValue(mockTimestamp as any);

      await saveUser(email);

      expect(getUsernameFromEmail).toHaveBeenCalledWith(email);
      expect(db.collection).toHaveBeenCalledWith("users");
      expect(addMock).toHaveBeenCalledWith({
        email,
        username: "mockedusername",
        createdAt: mockTimestamp,
      });
    });
  });
});
