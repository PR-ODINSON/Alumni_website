import jwt from 'jsonwebtoken';
import { UserRole } from '../models/User';

export const generateAccessToken = (id: string, role: UserRole): string => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  } as jwt.SignOptions);
};

export const generateRefreshToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d',
  } as jwt.SignOptions);
};

export const verifyRefreshToken = (token: string): { id: string } => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { id: string };
};

export const generateEmailToken = (): string => {
  return jwt.sign({ rand: Math.random() }, process.env.JWT_SECRET!, {
    expiresIn: '24h',
  } as jwt.SignOptions);
};
