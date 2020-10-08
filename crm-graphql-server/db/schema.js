const { gql } = require('apollo-server');

// Schema
const typeDefs = gql`
    #Inputs
    input UserInput {
        name: String!
        surname: String!
        email: String!
        password: String!
    }

    input AutenticateInput {
        email: String!
        password: String!
    }

    input ProductInput {
        name: String!
        existence: Int!
        price: Float!
    }

    input ClientInput {
        name: String!
        surname: String!
        company: String!
        email: String!
        phone: String
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

    type Product {
        id: ID
        name: String
        existence: Int
        price: Float
        createdAt: String
    }

    type Client {
        id: ID
        name: String
        surname: String
        company: String
        email: String
        phone: String
        createdAt: String
        seller: ID
    }

    # Queries
    type Query {
        # Users
        getUser(token: String!): User

        # Products
        getProducts: [Product]
        getProduct(id: ID!): Product

        #Clients
        getClients: [Client]
        getClientsSeller: [Client]
        getClient(id: ID!): Client
    }

    # Mutations
    type Mutation {
        # Users
        newUser(input: UserInput): User
        autenticateUser(input: AutenticateInput): Token

        # Products
        newProduct(input: ProductInput): Product
        updateProduct(id: ID!, input: ProductInput): Product
        deleteProduct(id: ID!): String

        # Clients
        newClient(input: ClientInput): Client
        updateClient(id: ID!, input: ClientInput): Client
        deleteClient(id: ID!): String
    }
`;

module.exports = typeDefs;
