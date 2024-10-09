import { jwtDecode } from "jwt-decode";
import { AccessTokenPayload } from "@/types/auth";
import { log } from "@/utils/logging";

function decodeAccessToken() {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    try {
      return jwtDecode<AccessTokenPayload>(accessToken);
    } catch (error) {
      log.error(error);
    }
  }
  return null;
}

export default decodeAccessToken;
