import type { User } from "./user";

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface AuthResponse extends TokenResponse {
  user: User;
}
