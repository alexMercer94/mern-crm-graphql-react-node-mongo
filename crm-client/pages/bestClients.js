import { gql, useQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Layout from '../components/Layout';

const GET_BEST_CLIENTS = gql`
    query getBestClinets {
        getBestClients {
            total
            client {
                name
                company
            }
        }
    }
`;

const BestClients = () => {
    const { data, loading, error, startPolling, stopPolling } = useQuery(GET_BEST_CLIENTS);

    useEffect(() => {
        startPolling(1000);
        return () => {
            stopPolling();
        };
    }, [startPolling, stopPolling]);

    if (loading) return 'Cargando...';

    const { getBestClients } = data;

    const clientChart = [];

    getBestClients.map((client, index) => {
        clientChart[index] = {
            ...client.client[0],
            total: client.total,
        };
    });

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Mejores Clientes</h1>
            <ResponsiveContainer width={'99%'} height={550}>
                <BarChart
                    className="mt-10"
                    width={600}
                    height={500}
                    data={clientChart}
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

export default BestClients;
