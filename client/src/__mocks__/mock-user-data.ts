import jwt from "jsonwebtoken";
import { AccessTokenPayload } from "@/context/auth-context";

function generateAccessToken(user: AccessTokenPayload) {
  return jwt.sign(user, "jwt_secret", { expiresIn: "15m" });
}

const user = {
  id: 1,
  name: "John Doe",
  image: "../../../public/avatar.png",
  email: "john.doe@example.com",
  username: "johndoe",
  role: "basic",
};

const userPassword = "pass1234";

const accessToken = generateAccessToken(user);

export { user, userPassword, accessToken };
