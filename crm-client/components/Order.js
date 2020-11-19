import { gql, useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const UPDATE_ORDER = gql`
    mutation updateOrder($id: ID!, $input: OrderInput) {
        updateOrder(id: $id, input: $input) {
            state
        }
    }
`;

const DELETE_ORDER = gql`
    mutation deleteOrder($id: ID!) {
        deleteOrder(id: $id)
    }
`;

const GET_ORDERS_SELLER = gql`
    query getOrdersSeller {
        getOrdersSeller {
            id
        }
    }
`;

const Order = ({ order }) => {
    const {
        id,
        total,
        client: { name, surname, phone, email },
        state,
        client,
    } = order;

    const [updateOrder] = useMutation(UPDATE_ORDER);
    const [deleteOrder] = useMutation(DELETE_ORDER, {
        update(cache) {
            const { getOrdersSeller } = cache.readQuery({ query: GET_ORDERS_SELLER });
            cache.writeQuery({
                query: GET_ORDERS_SELLER,
                data: {
                    getOrdersSeller: getOrdersSeller.filter((currentOrder) => currentOrder.id !== id),
                },
            });
        },
    });

    const [stateOrder, setStateOrder] = useState(state);
    const [clase, setClase] = useState('');

    useEffect(() => {
        if (stateOrder) {
            setStateOrder(setStateOrder);
        }
        orderClass();
    }, [stateOrder]);

    /**
     * Change order's color acording to the state of order
     */
    const orderClass = () => {
        if (stateOrder === 'PENDIENTE') {
            setClase('border-yellow-500');
        } else if (stateOrder === 'COMPLETADO') {
            setClase('border-green-500');
        } else {
            setClase('border-red-800');
        }
    };

    /**
     * Change Order's state
     */
    const changeOrderState = async (newState) => {
        try {
            const { data } = await updateOrder({
                variables: {
                    id,
                    input: {
                        state: newState,
                        client: client.id,
                    },
                },
            });
            setStateOrder(data.updateOrder.state);
        } catch (error) {
            console.log(error);
        }
    };

    /**
     * Delete an order
     */
    const confirmDeleteOrder = () => {
        Swal.fire({
            title: '¿Deseas eliminar a este pedido?',
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
                    const { data } = await deleteOrder({
                        variables: {
                            id,
                        },
                    });

                    Swal.fire('Eliminado!', data.deleteOrder, 'success');
                } catch (error) {
                    console.log(error);
                }
            }
        });
    };

    return (
        <div className={`${clase} border-t-4 mt-4 bg-white rounded p-6 md:grid md:grid-cols-2 md:gap-4 shadow-lg`}>
            <div className="">
                <p className="font-bold text-gray-800">
                    Cliente {name} {surname}
                </p>
                {email && (
                    <p className="flex items-center my-2">
                        <svg
                            className="w-6 h-6 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            ></path>
                        </svg>
                        {email}
                    </p>
                )}
                {phone && (
                    <p className="flex items-center my-2">
                        <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            ></path>
                        </svg>
                        {phone}
                    </p>
                )}
                <h2 className="text-gray-800 font-bold mt-10">Estado pedido</h2>
                <select
                    className="mt-2 appearance-none bg-blue-600 border border-blue-600 text-white p-2 text-center rounded leading-tight focus:outline-none focus:bg-blue-600 focus:border-blue-500 uppercase text-xs font-bold"
                    value={stateOrder}
                    onChange={(e) => changeOrderState(e.target.value)}
                >
                    <option value="COMPLETADO">COMPLETADO</option>
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="CANCELADO">CANCELADO</option>
                </select>
            </div>
            <div>
                <h2 className="text-gray-800 font-bold mt-2">Resumen del Pedido</h2>
                {order.order.map((article) => (
                    <div key={article.id} className="mt-4">
                        <p className="text-sm text-gray-600">Producto: {article.name}</p>
                        <p className="text-sm text-gray-600">Cantidad: {article.quantity} </p>
                    </div>
                ))}

                <p className="text-gray-800 mt-3 font-bold">
                    Total a pagar: <span className="font-light">$ {total}</span>
                </p>
                <button
                    onClick={() => confirmDeleteOrder()}
                    className="flex items-center mt-4 bg-red-800 px-5 py-2 inline-block text-white rounded leading-tight uppercase text-xs font-bold"
                >
                    Eliminar Pedido
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
            </div>
        </div>
    );
};

export default Order;
