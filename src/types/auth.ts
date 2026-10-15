export interface PublicUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthPayload {
  accessToken: string;
  expiresIn: number;
  user: PublicUser;
}