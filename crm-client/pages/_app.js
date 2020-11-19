import { ApolloProvider } from '@apollo/client';
import client from '../config/apollo';
import OrderState from '../context/Orders/OrderState';

function MyApp({ Component, pageProps }) {
    return (
        <ApolloProvider client={client}>
            <OrderState>
                <Component {...pageProps} />
            </OrderState>
        </ApolloProvider>
    );
}

export default MyApp;
