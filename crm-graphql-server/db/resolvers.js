// * Resolvers

const resolvers = {
    Query: {
        getCourse: () => 'Algo',
    },
    Mutation: {
        newUser: () => 'Creating new user',
    },
};

module.exports = resolvers;
