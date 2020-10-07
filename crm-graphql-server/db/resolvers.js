const User = require('../models/User');
const bcrytpjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });

/**
 * Create JWT
 * @param {*} user User data
 * @param {*} secretWord Secret word
 * @param {*} expiresIn Expiration time
 */
const createToken = (user, secretWord, expiresIn) => {
    const { id, email, name, surname } = user;
    return jwt.sign({ id, email, name, surname }, secretWord, { expiresIn });
};

// * Resolvers

const resolvers = {
    Query: {
        /**
         * Get user autenticated and check JWT
         */
        getUser: async (_, { token }) => {
            const userId = await jwt.verify(token, process.env.SECRET);
            return userId;
        },
    },
    Mutation: {
        /**
         * Create a new user
         */
        newUser: async (_, { input }) => {
            const { email, password } = input;

            // Check if user is registered
            const existUser = await User.findOne({ email });
            console.log(existUser);
            if (existUser) {
                throw new Error('El usuario ya esta registrado');
            }

            // Hash password
            const salt = await bcrytpjs.genSalt(10);
            input.password = await bcrytpjs.hash(password, salt);

            // Save in DB
            try {
                const user = new User(input);
                user.save();
                return user;
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Autenticate a user
         */
        autenticateUser: async (_, { input }) => {
            const { email, password } = input;
            // If user exist
            const userExist = await User.findOne({ email });
            if (!userExist) {
                throw new Error('El usuario no existe.');
            }

            // Check if password is correct
            const correctPassword = await bcrytpjs.compare(password, userExist.password);
            if (!correctPassword) {
                throw new Error('El password no es correcto.');
            }

            // Create token
            return {
                token: createToken(userExist, process.env.SECRET, '24h'),
            };
        },
    },
};

module.exports = resolvers;
