import {getUsernameFromEmail} from "../../utils/email.service";

describe("getUsernameFromEmail", () => {
  it("should return the username without special characters", () => {
    const email = "john.doe-123@example.com";
    const result = getUsernameFromEmail(email);
    expect(result).toBe("johndoe123");
  });

  it("should return the full username if it has" +
    "only alphanumeric characters", () => {
    const email = "johnDoe123@example.com";
    const result = getUsernameFromEmail(email);
    expect(result).toBe("johnDoe123");
  });

  it("should return an empty string if email starts with @", () => {
    const email = "@example.com";
    const result = getUsernameFromEmail(email);
    expect(result).toBe("");
  });

  it("should return empty string if username is" +
    "only special characters", () => {
    const email = "...---!!!@domain.com";
    const result = getUsernameFromEmail(email);
    expect(result).toBe("");
  });

  it("should ignore the domain part of the email", () => {
    const email = "test.user@sub.domain.com";
    const result = getUsernameFromEmail(email);
    expect(result).toBe("testuser");
  });
});
