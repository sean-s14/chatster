import { jwtDecode } from "jwt-decode";
import { AccessTokenPayload } from "@/types/auth";

function decodeAccessToken() {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    try {
      return jwtDecode<AccessTokenPayload>(accessToken);
    } catch (error) {
      import.meta.env.DEV && console.error(error);
    }
  }
  return null;
}

export default decodeAccessToken;
