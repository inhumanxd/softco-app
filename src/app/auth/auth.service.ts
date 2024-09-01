import { JWTHelper } from "@/helpers/jwt.helper";
import { IJWTTokens } from "@/interfaces/IJWT";

export class AuthService {
  static refreshToken(refreshToken: string): IJWTTokens {
    const isValidRefreshToken = JWTHelper.verifyRefreshToken(refreshToken);
    if (!isValidRefreshToken) throw new Error(`Invalid refresh token ${isValidRefreshToken}`);

    const user = JWTHelper.verifyRefreshToken(refreshToken);
    const tokens = JWTHelper.generateTokens({
      _id: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      hasAccessTo: user.hasAccessTo,
    });
    return tokens;
  }
}
