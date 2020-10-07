const { gql } = require('apollo-server');

// Schema
const typeDefs = gql`
    type Query {
        getUser(token: String!): User
    }

    #Inputs
    input UserInput {
        name: String!
        surname: String!
        email: String!
        password: String!
    }

    input AutenticateInput {
        email: String
        password: String
    }

    # Types
    type User {
        id: ID
        name: String
        surname: String
        email: String
        createdAt: String
    }

    type Token {
        token: String
    }

    # Mutations
    type Mutation {
        newUser(input: UserInput): User
        autenticateUser(input: AutenticateInput): Token
    }
`;

module.exports = typeDefs;
