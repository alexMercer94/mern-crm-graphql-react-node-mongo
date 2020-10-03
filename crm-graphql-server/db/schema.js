const { gql } = require('apollo-server');

// Schema
const typeDefs = gql`
    type Query {
        getCourse: String
    }

    # Types
    type User {
        id: ID
        name: String
        surname: String
        email: String
        createdAt: String
    }

    # Mutations
    type Mutation {
        newUser: String
    }
`;

module.exports = typeDefs;
