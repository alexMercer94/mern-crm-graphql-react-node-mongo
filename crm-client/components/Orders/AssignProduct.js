import { gql, useQuery } from '@apollo/client';
import React, { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import OrderContext from '../../context/Orders/OrderContext';

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

const AssignProduct = () => {
    const [products, setProducts] = useState([]);

    const { data, loading, error } = useQuery(GET_PRODUCTS);

    // Order's Context
    const orderContext = useContext(OrderContext);
    const { addProducts } = orderContext;

    useEffect(() => {
        addProducts(products);
    }, [products]);

    /**
     * Select products
     * @param {*} productsSelected
     */
    const selectProducts = (productsSelected) => {
        setProducts(productsSelected);
    };

    if (loading) return null;

    const { getProducts } = data;

    return (
        <>
            <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">
                2.- Selecciona o busca los productos
            </p>
            <Select
                className="mt-3"
                isMulti={true}
                options={getProducts}
                onChange={(option) => selectProducts(option)}
                placeholder="Busque o Seleccione los Productos"
                getOptionLabel={(options) => `${options.name} - ${options.existence} Disponibles`}
                getOptionValue={(options) => options.id}
                noOptionsMessage={() => 'No hay resultados'}
            />
        </>
    );
};

export default AssignProduct;
