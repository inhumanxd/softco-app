import { env } from "@/config/envConfig";
import { IUserJWTPayload } from "@/interfaces/IJWT";
import { sign, verify, JwtPayload } from "jsonwebtoken";

export interface JWTAccessPayload extends JwtPayload, IUserJWTPayload {}
export interface JWTRefreshPayload extends JwtPayload, JWTAccessPayload {
  token: string;
}

export class JWTHelper {
  static generateAccessToken(user: IUserJWTPayload) {
    return sign(user, env.JWT_ACCESS_SECRET ?? `DO_NOT_HAVE_ANY_SECRETS`, {
      expiresIn: env.JWT_ACCESS_TOKEN_EXPIRY ?? `1h`,
    });
  }

  static generateRefreshToken({ token, ...user }: { token: string } & IUserJWTPayload) {
    return sign({ token, ...user }, env.JWT_REFRESH_SECRET ?? `DO_NOT_HAVE_ANY_REFRESH_SECRETS`, {
      expiresIn: env.JWT_REFRESH_TOKEN_EXPIRY ?? `7d`,
    });
  }

  private static verifyToken<T>(token: string, secret: string): T {
    return verify(token, secret, { ignoreExpiration: true }) as T;
  }

  static verifyAccessToken(token: string): JWTAccessPayload {
    return this.verifyToken<JWTAccessPayload>(token, env.JWT_ACCESS_SECRET ?? `DO_NOT_HAVE_ANY_SECRETS`);
  }

  static verifyRefreshToken(token: string): JWTRefreshPayload {
    return this.verifyToken<JWTRefreshPayload>(token, env.JWT_REFRESH_SECRET ?? `DO_NOT_HAVE_ANY_REFRESH_SECRETS`);
  }

  static generateTokens(user: IUserJWTPayload) {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken({ token: accessToken, ...user });
    return { accessToken, refreshToken };
  }

  static verifyTokens(
    accessToken: string,
    refreshToken: string
  ): { decodedAccessToken: JWTAccessPayload; decodedRefreshToken: JWTRefreshPayload } {
    const decodedAccessToken = this.verifyAccessToken(accessToken);
    const decodedRefreshToken = this.verifyRefreshToken(refreshToken);
    return { decodedAccessToken, decodedRefreshToken };
  }
}
