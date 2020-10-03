const { ApolloServer } = require('apollo-server');
const connectDB = require('./config/db');
const resolvers = require('./db/resolvers');
const typeDefs = require('./db/schema');

// * Connect to Database
connectDB();

// * Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// * Start server
server.listen().then(({ url }) => {
    console.log(`Server started on URL ${url}`);
});
