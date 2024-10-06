export interface AccessTokenPayload extends JwtPayload {
  id: number;
  email: string;
  username: string;
  name?: string;
  image?: string;
  role: string;
}
