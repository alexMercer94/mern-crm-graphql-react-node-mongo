const { ApolloServer } = require('apollo-server');
const connectDB = require('./config/db');
const resolvers = require('./db/resolvers');
const typeDefs = require('./db/schema');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });

// * Connect to Database
connectDB();

// * Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        const token = req.headers['authorization'] || '';
        if (token) {
            try {
                const user = jwt.verify(token, process.env.SECRET);
                return {
                    user,
                };
            } catch (error) {
                console.log('Hubo un error');
                console.log(error);
            }
        }
    },
});

// * Start server
server.listen().then(({ url }) => {
    console.log(`Server started on URL ${url}`);
});
