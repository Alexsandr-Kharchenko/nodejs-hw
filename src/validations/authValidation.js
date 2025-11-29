import { Joi, Segments } from 'celebrate';

// Спільна валідація пароля
const passwordValidation = Joi.string().min(8).required();

// Реєстрація користувача
export const registerUserSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: passwordValidation,
  }),
};

// Логін
export const loginUserSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

// Запит на відправку email для скидання пароля
export const requestResetEmailSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
  }),
};

// Скидання пароля
export const resetPasswordSchema = {
  [Segments.BODY]: Joi.object({
    token: Joi.string().required(),
    password: passwordValidation,
  }),
};
