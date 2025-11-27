import createHttpError from 'http-errors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { User } from '../models/user.js';
import { Session } from '../models/session.js';

import { createSession, setSessionCookies } from '../services/auth.js';
import { sendEmail } from '../utils/sendMail.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

// ------------------- РЕЄСТРАЦІЯ -------------------
export const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) throw createHttpError(400, 'Email in use');

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashed,
      username: email, // дублюється pre("save")
    });

    const session = await createSession(user._id);
    setSessionCookies(res, session);

    res.status(201).json(user.toJSON());
  } catch (err) {
    next(err);
  }
};

// ------------------- ЛОГІН -------------------
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw createHttpError(401, 'Invalid credentials');

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw createHttpError(401, 'Invalid credentials');

    await Session.deleteMany({ userId: user._id });

    const session = await createSession(user._id);
    setSessionCookies(res, session);

    res.json(user.toJSON());
  } catch (err) {
    next(err);
  }
};

// ------------------- REFRESH -------------------
export const refreshUserSession = async (req, res, next) => {
  try {
    const { sessionId, refreshToken } = req.cookies;

    if (!sessionId || !refreshToken) {
      throw createHttpError(401, 'Session not found');
    }

    const session = await Session.findById(sessionId);
    if (!session || session.refreshToken !== refreshToken) {
      throw createHttpError(401, 'Session not found');
    }

    if (session.refreshTokenValidUntil < new Date()) {
      throw createHttpError(401, 'Session expired');
    }

    await Session.findByIdAndDelete(sessionId);

    const newSession = await createSession(session.userId);
    setSessionCookies(res, newSession);

    res.json({ message: 'Session refreshed' });
  } catch (err) {
    next(err);
  }
};

// ------------------- LOGOUT -------------------
export const logoutUser = async (req, res, next) => {
  try {
    const { sessionId } = req.cookies;

    if (sessionId) {
      await Session.findByIdAndDelete(sessionId);
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.clearCookie('sessionId');

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// ------------------- RESET EMAIL -------------------
export const requestResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // Навіть якщо юзера нема, відповідаємо успішно
    if (!user) {
      return res.json({ message: 'Password reset email sent successfully' });
    }

    const token = jwt.sign(
      { sub: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' },
    );

    const resetLink = `${process.env.FRONTEND_DOMAIN}/reset-password?token=${token}`;

    await sendEmail({
      to: user.email,
      subject: 'Reset your password',
      html: `<p>Hello ${user.username},</p>
             <p>Click the link to reset your password:</p>
             <a href="${resetLink}">${resetLink}</a>`,
    });

    res.json({ message: 'Password reset email sent successfully' });
  } catch (err) {
    next(err);
  }
};

// ------------------- RESET PASSWORD -------------------
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      throw createHttpError(401, 'Invalid or expired token');
    }

    const user = await User.findById(payload.sub);
    if (!user) throw createHttpError(404, 'User not found');

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    next(err);
  }
};

// ------------------- UPDATE AVATAR -------------------
export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.user) {
      throw createHttpError(401, 'Not authenticated');
    }

    if (!req.file) {
      throw createHttpError(400, 'No file');
    }

    const result = await saveFileToCloudinary(req.file.buffer);

    req.user.avatar = result.secure_url;
    await req.user.save();
    console.log('FILE:', req.file);

    res.status(200).json({ url: result.secure_url });
  } catch (err) {
    next(err);
  }
};
