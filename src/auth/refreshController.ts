import { createAccessToken, createRefreshToken } from './index';
import Branca from 'branca';
import { User } from '../entity/User';
import { Request, Response } from 'express';

export const refresh = async (req: Request, res: Response) => {
  const token = req.cookies.fid;
  if (!token) {
    return res.status(400).json({
      ErrorCode: 'invalid_request',
      Error: 'Missing Refresh Token',
    });
  }

  let decoded = '';
  try {
    const branca = Branca(process.env.REFRESH_TOKEN_SECRET);
    decoded = branca.decode(token, parseInt(process.env.REFRESH_TOKEN_TTL!));
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      ErrorCode: 'invalid_request',
      Error: 'Invalid Refresh Token',
    });
  }

  const payload = JSON.parse(decoded);

  const user = await User.findOne({ id: payload.userId });
  if (!user) {
    return res.status(400).json({
      ErrorCode: 'invalid_request',
      Error: 'Missing Token User',
    });
  }

  const accessToken = createAccessToken(user);

  res.cookie('fid', createRefreshToken(user), {
    httpOnly: true,
  });

  return res.status(200).json({ token: accessToken });
};
