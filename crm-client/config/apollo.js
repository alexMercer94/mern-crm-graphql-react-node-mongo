import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import fetch from 'node-fetch';

/**
 * * Settings for Apollo Client
 */
const client = new ApolloClient({
    connectToDevTools: true,
    cache: new InMemoryCache(),
    link: new HttpLink({
        uri: 'http://localhost:4000/',
        fetch,
    }),
});

export default client;
