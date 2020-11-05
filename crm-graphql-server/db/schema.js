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

    input ProductOrderInput {
        id: ID
        quantity: Int
    }

    input OrderInput {
        order: [ProductOrderInput]
        total: Float
        client: ID
        state: OrderState
    }

    #Enums
    enum OrderState {
        PENDIENTE
        COMPLETADO
        CANCELADO
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

    type Order {
        id: ID
        order: [OrderGroup]
        total: Float
        client: ID
        seller: ID
        createdAt: String
        state: OrderState
    }

    type OrderGroup {
        id: ID
        quantity: Int
    }

    type TopClient {
        total: Float
        client: [Client]
    }

    type TopSeller {
        total: Float
        seller: [User]
    }

    # Queries
    type Query {
        # Users
        getUser: User

        # Products
        getProducts: [Product]
        getProduct(id: ID!): Product

        # Clients
        getClients: [Client]
        getClientsSeller: [Client]
        getClient(id: ID!): Client

        # Orders
        getOrders: [Order]
        getOrdersSeller: [Order]
        getOrder(id: ID!): Order
        getOrdersState(state: String!): [Order]

        # Anvanced searches
        getBestClients: [TopClient]
        getBestSellers: [TopSeller]
        searchProduct(text: String!): [Product]
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

        # Orders
        newOrder(input: OrderInput): Order
        updateOrder(id: ID!, input: OrderInput): Order
        deleteOrder(id: ID!): String
    }
`;

module.exports = typeDefs;
