import decodeAccessToken from "./decode-access-token";
import { user, accessToken } from "@/__mocks__/mock-user-data";

describe("decodeAccessToken", () => {
  it("should return null if no access token is found", () => {
    localStorage.removeItem("accessToken");
    const decodedToken = decodeAccessToken();
    console.log("decodedToken:", decodedToken);
    expect(decodedToken).toBeNull();
  });

  it("should return the decoded access token payload", () => {
    localStorage.setItem("accessToken", accessToken);
    const decodedToken = decodeAccessToken();
    expect(decodedToken).toMatchObject(user);
  });

  it("should return null if the access token is invalid", () => {
    localStorage.setItem("accessToken", "invalid_token");
    const decodedToken = decodeAccessToken();
    expect(decodedToken).toBeNull();
  });
});
