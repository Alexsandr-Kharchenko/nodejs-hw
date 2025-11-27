import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      throw createHttpError(401);
    }

    const session = await Session.findOne({ accessToken });
    if (!session) {
      throw createHttpError(401);
    }

    if (session.accessTokenValidUntil < new Date()) {
      throw createHttpError(401);
    }

    const user = await User.findById(session.userId);
    if (!user) {
      throw createHttpError(401);
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
