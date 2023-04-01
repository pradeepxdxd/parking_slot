import { validation } from "./validation.middleware.js";
import { body } from "express-validator";

export const validateSignUp = validation([
    body('userName').isString().withMessage('User Name is required'),
    body('email').isEmail().withMessage('invalid email address'),
    body('password').isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minSymbols: 1 }).withMessage('password is must be above 8 letters'),
    body('contact').isMobilePhone().withMessage('invalid mobile number')
]);

export const validateLogin = validation([
    body("email").isEmail().withMessage("Email is required"),
    body("password").isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minSymbols: 1 }).withMessage('password is must be above 8 letters')
])