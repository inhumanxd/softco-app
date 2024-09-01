export interface IUserJWTPayload {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  hasAccessTo: string[];
}

export interface IJWTTokens {
  accessToken: string;
  refreshToken: string;
}
