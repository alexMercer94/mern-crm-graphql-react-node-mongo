import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import React from 'react';
import Layout from '../components/Layout';
import Product from '../components/Product';

const GET_PRODUCTS = gql`
    query getProducts {
        getProducts {
            id
            name
            existence
            price
            createdAt
        }
    }
`;

const Products = () => {
    const { data, loading, error } = useQuery(GET_PRODUCTS);

    if (loading) return 'Cargando...';

    return (
        <div>
            <Layout>
                <h1 className="text-2xl text-gray-800 font-light">Productos</h1>
                <Link href="/newProduct">
                    <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 hover: text-gray-200 mb-3 uppercase font-bold">
                        Nuevo Producto
                    </a>
                </Link>
                <table className="table-auto shadow-md mt-10 w-full w-lg">
                    <thead className="bg-gray-800">
                        <tr className="text-white">
                            <th className="w-1/5 py-2">Nombre</th>
                            <th className="w-1/5 py-2">Existencia</th>
                            <th className="w-1/5 py-2">Precio</th>
                            <th className="w-1/5 py-2">Eliminar</th>
                            <th className="w-1/5 py-2">Editar</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {data.getProducts.map((product) => (
                            <Product key={product.id} product={product} />
                        ))}
                    </tbody>
                </table>
            </Layout>
        </div>
    );
};

export default Products;
