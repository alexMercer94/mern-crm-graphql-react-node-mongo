import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import React from 'react';
import Layout from '../components/Layout';
import Order from '../components/Order';

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

const Orders = () => {
    const { data, loading, error } = useQuery(GET_ORDERS_SELLER);

    if (loading) return 'Cargando...';

    const { getOrdersSeller } = data;

    return (
        <div>
            <Layout>
                <h1 className="text-2xl text-gray-800 font-light">Pedidos</h1>
                <Link href="/newOrder">
                    <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold">
                        Nuevo Pedido
                    </a>
                </Link>
                {getOrdersSeller.length === 0 ? (
                    <p className="mt-5 text-center text-2xl">No hay pedidos aún</p>
                ) : (
                    getOrdersSeller.map((order) => <Order key={order.id} order={order} />)
                )}
            </Layout>
        </div>
    );
};

export default Orders;
