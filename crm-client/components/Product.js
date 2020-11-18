import { gql, useMutation } from '@apollo/client';
import Router from 'next/router';
import React from 'react';
import Swal from 'sweetalert2';

const DELETE_PRODUCT = gql`
    mutation deleteProduct($id: ID!) {
        deleteProduct(id: $id)
    }
`;

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

const Product = ({ product }) => {
    const { name, price, existence, id } = product;

    const [deleteProduct] = useMutation(DELETE_PRODUCT, {
        update(cache) {
            const { getProducts } = cache.readQuery({ query: GET_PRODUCTS });
            cache.writeQuery({
                query: GET_PRODUCTS,
                data: {
                    getProducts: getProducts.filter((currentProduct) => currentProduct.id !== id),
                },
            });
        },
    });

    /**
     * Delete a product
     */
    const confirmDeleteProduct = () => {
        Swal.fire({
            title: '¿Deseas eliminar a este producto?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar',
            cancelButtonText: 'No, Cancelar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const { data } = await deleteProduct({
                        variables: {
                            id,
                        },
                    });

                    Swal.fire('Correcto!', data.deleteProduct, 'success');
                } catch (error) {
                    console.log(error);
                }
            }
        });
    };

    /**
     * Redirect to edit product page
     */
    const editProduct = () => {
        Router.push({
            pathname: '/editProduct/[id]',
            query: { id },
        });
    };

    return (
        <tr>
            <td className="border px-4 py-2">{name}</td>
            <td className="border px-4 py-2">{existence} piezas</td>
            <td className="border px-4 py-2">$ {price}</td>
            <td className="border px-4 py-2">
                <button
                    type="button"
                    className="flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                    onClick={() => confirmDeleteProduct()}
                >
                    Eliminar{' '}
                    <svg
                        className="w-4 h-4 ml-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </button>
            </td>
            <td className="border px-4 py-2">
                <button
                    type="button"
                    className="flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                    onClick={() => editProduct()}
                >
                    Editar{' '}
                    <svg
                        className="w-4 h-4 ml-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                    </svg>
                </button>
            </td>
        </tr>
    );
};

export default Product;
