import {formatTimestamp} from "../../utils/dates.service";
import * as admin from "firebase-admin";

describe("formatTimestamp", () => {
  it("should format a Firestore Timestamp to YYYYMMDDHHmmss", () => {
    const testDate = new Date("2023-12-25T14:30:45Z");
    const timestamp = admin.firestore.Timestamp.fromDate(testDate);
    const formatted = formatTimestamp(timestamp);
    expect(formatted).toBe("20231225143045");
  });

  it("should pad month, day, hour, minute, and second with zeros", () => {
    const testDate = new Date("2023-01-05T08:09:07Z");
    const timestamp = admin.firestore.Timestamp.fromDate(testDate);
    const formatted = formatTimestamp(timestamp);
    expect(formatted).toBe("20230105080907");
  });
});
