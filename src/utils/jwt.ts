import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';

export const generateToken = (
  payload: object,
  expiresIn: string | number = '1h',
): string => {
  const options: SignOptions = {
    expiresIn: expiresIn as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): string | jwt.JwtPayload => {
  return jwt.verify(token, JWT_SECRET);
};
