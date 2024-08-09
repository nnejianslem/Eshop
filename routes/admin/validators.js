const { check } = require('express-validator');
const usersRepo = require('../../repositories/users');

module.exports = {
    requireTitle: check('title')
    .trim()
    .isLength({ min: 3, max: 40})
    .withMessage('Must be between 3 and 40 charactors'),

    requirePrice: check('price')
    .trim()
    .toFloat()
    .isFloat({ min: 1 })
    .withMessage('Must be a number greater than 1'),

    requireEmail:  check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must be a valid Email')
    .custom(async (email) => {
        const existingUser = await usersRepo.getOneBy({ email })
        if (existingUser) {
            throw new Error('This Email has been used');
        }
    }),

    requirePassword:check('password')
    .trim()
    .isLength({min: 5, max: 20})
    .withMessage('Must be between 4 and 20 characters'),

    requirePasswordConfirmation: check('passwordConfirmation')
    .trim()
    .isLength({min: 5, max: 20})
    .withMessage('Must be between 4 and 20 characters')
    .custom(async (passwordConfirmation, { req }) => {
        if(passwordConfirmation !== req.body.password) {
            throw new Error('Passwords does not match');
        }
    }),

    requireExistingEmail: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Invalid Email')
    .custom(async (email) => {
        const user = await usersRepo.getOneBy({email});
        if (!user) {
            throw new Error('Email not found');
        }
    }),

    requireExitingPassword: check('password')
    .trim()
    .custom(async (password, { req }) => {
        const user = await usersRepo.getOneBy({ email: req.body.email});
        if (!user) {
            throw new Error('Invalid password');
        }

        const validPassword = await usersRepo.comparePasswords(
            user.password,
            password
        );
        if (!validPassword) {
            throw new Error('Incorrect Password');
        }
    })
};