import { sign, SignOptions } from 'jsonwebtoken';
import * as dotenv from 'dotenv';

// Load the appropriate .env file based on NODE_ENV
const envFile =
  process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev';
dotenv.config({ path: envFile });

const refreshTokenSecurityKey =
  process.env.JWT_SECRET_REFRESH_KEY || 'default-test-secret';

const generateRefreshToken = (payload: any, options: SignOptions): string => {
  if (!refreshTokenSecurityKey || refreshTokenSecurityKey === '') {
    throw new Error(
      'JWT_SECRET_REFRESH_KEY must be defined in environment variables',
    );
  }
  return sign(payload, refreshTokenSecurityKey, options);
};

export default generateRefreshToken;
