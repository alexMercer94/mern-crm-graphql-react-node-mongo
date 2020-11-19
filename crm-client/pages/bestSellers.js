import { gql, useQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Layout from '../components/Layout';

const GET_BEST_SELLERS = gql`
    query getBestSellers {
        getBestSellers {
            total
            seller {
                name
                surname
                email
            }
        }
    }
`;

const BestSellers = () => {
    const { data, loading, error, startPolling, stopPolling } = useQuery(GET_BEST_SELLERS);

    useEffect(() => {
        startPolling(1000);
        return () => {
            stopPolling();
        };
    }, [startPolling, stopPolling]);

    if (loading) return 'Cargando...';

    const { getBestSellers } = data;

    const sellerChart = [];
    getBestSellers.map((seller, index) => {
        sellerChart[index] = {
            ...seller.seller[0],
            total: seller.total,
        };
    });

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Mejores Vendedores</h1>
            <ResponsiveContainer width={'99%'} height={550}>
                <BarChart
                    className="mt-10"
                    width={600}
                    height={500}
                    data={sellerChart}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#3182ce" />
                </BarChart>
            </ResponsiveContainer>
        </Layout>
    );
};

export default BestSellers;
