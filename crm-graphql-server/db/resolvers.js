const User = require('../models/User');
const Product = require('../models/Product');
const Client = require('../models/Client');
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
        /**
         * Get all products
         */
        getProducts: async () => {
            try {
                const products = await Product.find({});
                return products;
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Get a specific product
         */
        getProduct: async (_, { id }) => {
            // Check if product exist
            const product = await Product.findById(id);

            if (!product) {
                throw new Error('Producto no encontrado.');
            }

            return product;
        },
        /**
         * Get all clients
         */
        getClients: async () => {
            try {
                const clients = await Client.find({});
                return clients;
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Get clients by seller
         */
        getClientsSeller: async (_, {}, ctx) => {
            try {
                const clients = await Client.find({ seller: ctx.user.id.toString() });
                return clients;
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Get a client using id
         */
        getClient: async (_, { id }, ctx) => {
            // Check if client exist
            const client = await Client.findById(id);
            if (!client) {
                throw new Error('Cliente no encontrado.');
            }

            // Quien creo el cliente puede verlo
            if (client.seller.toString() !== ctx.user.id) {
                throw new Error('No tienes las credenciales');
            }

            return client;
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
        /**
         * Create a new product
         */
        newProduct: async (_, { input }) => {
            try {
                const product = new Product(input);
                // Save in db
                const result = await product.save();
                return result;
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Uptate a specific product data
         */
        updateProduct: async (_, { id, input }) => {
            // Check if product exist
            let product = await Product.findById(id);

            if (!product) {
                throw new Error('Producto no encontrado.');
            }

            // Save in db
            product = await Product.findOneAndUpdate({ _id: id }, input, { new: true });

            return product;
        },
        /**
         * Delete a specific product
         */
        deleteProduct: async (_, { id }) => {
            // Check if product exist
            const product = await Product.findById(id);

            if (!product) {
                throw new Error('Producto no encontrado.');
            }

            await Product.findByIdAndDelete({ _id: id });

            return 'Producto eliminado correctamente.';
        },
        /**
         * Create a new client
         */
        newClient: async (_, { input }, ctx) => {
            const { email } = input;
            // Verify if client is registered
            const client = await Client.findOne({ email });
            if (client) {
                throw new Error('El cliente ya esta registrado.');
            }

            const newClient = new Client(input);
            // Asignar el vendedor
            newClient.seller = ctx.user.id;

            // Save un db
            try {
                const result = await newClient.save();
                return result;
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Update a client
         */
        updateClient: async (_, { id, input }, ctx) => {
            // Verify if exist
            let client = await Client.findById(id);

            if (!client) {
                throw new Error('El cliente no existe.');
            }

            // Verify if seller  is who edits
            if (client.seller.toString() !== ctx.user.id) {
                throw new Error('No tienes las credenciales');
            }

            // Save client
            client = await Client.findOneAndUpdate({ _id: id }, input, { new: true });

            return client;
        },
        deleteClient: async (_, { id }, ctx) => {
            // Verify if exist
            const client = await Client.findById(id);

            if (!client) {
                throw new Error('El cliente no existe.');
            }

            // Verify if seller  is who deletes
            if (client.seller.toString() !== ctx.user.id) {
                throw new Error('No tienes las credenciales');
            }

            // Delete client
            await Client.findOneAndDelete({ _id: id });
            return 'Cliente eliminado.';
        },
    },
};

module.exports = resolvers;
