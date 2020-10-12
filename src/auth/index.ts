import Branca from 'branca';
import { User } from 'entity/User';

export const createAccessToken = (user: User) => {
  const branca = Branca(process.env.ACCESS_TOKEN_SECRET);
  const token = branca.encode(JSON.stringify({ userId: user.id }));

  return {
    access_token: token,
    expiry: branca.timestamp(token) + parseInt(process.env.ACCESS_TOKEN_TTL!),
  };
};

export const createRefreshToken = (user: User) => {
  const branca = Branca(process.env.REFRESH_TOKEN_SECRET);

  return branca.encode(JSON.stringify({ userId: user.id }));
};
