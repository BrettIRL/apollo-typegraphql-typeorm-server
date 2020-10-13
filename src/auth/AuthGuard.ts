import Branca from 'branca';
import { AuthChecker } from 'type-graphql';
import { Context } from '../types/context.interface';

export const AuthGuard: AuthChecker<Context> = ({ context }) => {
  const accessToken = context.req.headers.authorization;
  if (!accessToken) return false;

  const branca = Branca(process.env.ACCESS_TOKEN_SECRET);
  const decoded = branca.decode(
    accessToken.replace('Bearer ', ''),
    parseInt(process.env.ACCESS_TOKEN_TTL!),
  );
  // If access token expired, check for and use refresh token to send new one
  const { userId } = JSON.parse(decoded);
  context.userId = userId;

  return true;
};
