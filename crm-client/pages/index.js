import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../components/Layout';

const GET_CLIENTS_SELLER = gql`
    query getClientsSeller {
        getClientsSeller {
            id
            name
            surname
            company
            email
        }
    }
`;

const Index = () => {
    const router = useRouter();

    const { data, loading, error } = useQuery(GET_CLIENTS_SELLER);

    if (loading) return 'Cargando...';

    if (!data.getClientsSeller) {
        console.log('entro');
        router.push('/login');
    }

    return (
        <div>
            <Layout>
                <h1 className="text-2xl text-gray-800 font-light">Clientes</h1>
                <Link href="newClient">
                    <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold">
                        Nuevo Cliente
                    </a>
                </Link>

                <table className="table-auto shadow-md mt-10 w-full w-lg">
                    <thead className="bg-gray-800">
                        <tr className="text-white">
                            <th className="w-1/5 py-2">Nombre</th>
                            <th className="w-1/5 py-2">Empresa</th>
                            <th className="w-1/5 py-2">Email</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {data.getClientsSeller.map((client) => (
                            <tr key={client.id}>
                                <td className="border px-4 py-2">
                                    {client.name} {client.surname}
                                </td>
                                <td className="border px-4 py-2">{client.company}</td>
                                <td className="border px-4 py-2">{client.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Layout>
        </div>
    );
};

export default Index;
