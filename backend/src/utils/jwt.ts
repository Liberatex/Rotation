import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { JWTPayload } from '../types';

export const generateTokens = (payload: JWTPayload): { accessToken: string; refreshToken: string } => {
  const tokenPayload = {
    userId: payload.userId,
    email: payload.email,
    firebaseUid: payload.firebaseUid,
  };

  // @ts-ignore - jsonwebtoken types are strict but these are valid string values
  const accessToken = jwt.sign(tokenPayload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });

  // @ts-ignore - jsonwebtoken types are strict but these are valid string values
  const refreshToken = jwt.sign(tokenPayload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): JWTPayload => {
  return jwt.verify(token, config.jwt.secret) as JWTPayload;
};

export const verifyRefreshToken = (token: string): JWTPayload => {
  return jwt.verify(token, config.jwt.refreshSecret) as JWTPayload;
};

