import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import Swal from 'sweetalert2';
import Layout from '../components/Layout';
import AssignClient from '../components/Orders/AssignClient';
import AssignProduct from '../components/Orders/AssignProduct';
import OrderSummary from '../components/Orders/OrderSummary';
import Total from '../components/Orders/Total';
import OrderContext from '../context/Orders/OrderContext';

const NEW_ORDER = gql`
    mutation newOrder($input: OrderInput) {
        newOrder(input: $input) {
            id
        }
    }
`;

const GET_ORDERS_SELLER = gql`
    query getOrdersSeller {
        getOrdersSeller {
            id
            order {
                id
                price
                quantity
                name
            }
            total
            client {
                id
                name
                surname
                email
                phone
            }
            state
        }
    }
`;

const NewOrder = () => {
    const [message, setMessage] = useState(null);
    const router = useRouter();

    // Order's Context
    const orderContext = useContext(OrderContext);
    const { client, products, total } = orderContext;

    const [newOrder] = useMutation(NEW_ORDER, {
        update(cache, { data: { newOrder } }) {
            const { getOrdersSeller } = cache.readQuery({ query: GET_ORDERS_SELLER });
            cache.writeQuery({
                query: GET_ORDERS_SELLER,
                data: {
                    getOrdersSeller: [...getOrdersSeller, newOrder],
                },
            });
        },
    });

    /**
     * Validate order
     */
    const validateOrder = () => {
        return !products.every((product) => product.quantity > 0) || total === 0 || client.length === 0
            ? ' opacity-50 cursor-not-allowed '
            : '';
    };

    /**
     * Create new order
     */
    const createNewOrder = async () => {
        const { id } = client;
        const order = products.map(({ __typename, createdAt, existence, ...product }) => product);

        try {
            const { data } = await newOrder({
                variables: {
                    input: {
                        client: id,
                        total,
                        order,
                    },
                },
            });

            router.push('/orders');
            Swal.fire('Correcto!', 'El pedido se registro correctamente.', 'success');
        } catch (error) {
            setMessage(error.message);
            setTimeout(() => {
                setMessage(null);
            }, 3000);
        }
    };

    /**
     * Show alert
     */
    const showMessage = () => {
        return (
            <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{message}</p>
            </div>
        );
    };

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Crear nuevo pedido</h1>
            {message && showMessage()}
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <AssignClient />
                    <AssignProduct />
                    <OrderSummary />
                    <Total />
                    <button
                        type="button"
                        className={`bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 ${validateOrder()}`}
                        onClick={createNewOrder}
                    >
                        Registrar pedido
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default NewOrder;
