jest.mock("firebase-functions", () => ({
  setGlobalOptions: jest.fn(),
}));

jest.mock("firebase-functions/v2/https", () => ({
  onRequest: jest.fn(),
}));

jest.mock("firebase-functions/params", () => ({
  defineSecret: jest.fn().mockReturnValue("mockedSecret"),
}));

jest.mock("../app", () => "mockedApp");

import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/v2/https";
import {defineSecret} from "firebase-functions/params";

describe("index.ts", () => {
  it("should configure global options and export API", () => {

    require("../index");

    expect(setGlobalOptions).toHaveBeenCalledWith({maxInstances: 10});
    expect(defineSecret).toHaveBeenCalledWith("JWT_SECRET");
    expect(onRequest).toHaveBeenCalledWith(
      {secrets: ["mockedSecret"]},
      "mockedApp"
    );
  });
});
