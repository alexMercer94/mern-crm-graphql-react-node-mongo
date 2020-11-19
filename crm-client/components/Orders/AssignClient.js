import { gql, useQuery } from '@apollo/client';
import React, { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import OrderContext from '../../context/Orders/OrderContext';

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

const AssignClient = () => {
    const [client, setClient] = useState([]);
    const { data, loading, error } = useQuery(GET_CLIENTS_SELLER);

    // Order's Context
    const orderContext = useContext(OrderContext);
    const { addClient } = orderContext;

    useEffect(() => {
        addClient(client);
    }, [client]);

    /**
     * Select a client
     * @param {*} clientSelected
     */
    const selectClient = (clientSelected) => {
        setClient(clientSelected);
    };

    if (loading) return null;

    const { getClientsSeller } = data;

    return (
        <>
            <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">
                1.- Asigna un cliente el pedido
            </p>
            <Select
                className="mt-3"
                options={getClientsSeller}
                onChange={(option) => selectClient(option)}
                placeholder="Busque o Seleccione el Cliente"
                getOptionLabel={(options) => `${options.name} ${options.surname}`}
                getOptionValue={(options) => options.id}
                noOptionsMessage={() => 'No hay resultados'}
            />
        </>
    );
};

export default AssignClient;
