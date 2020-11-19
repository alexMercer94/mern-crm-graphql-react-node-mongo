import React, { useReducer } from 'react';
import { AMOUNT_PRODUCT, SELECT_CLIENT, SELECT_PRODUCT, UPDATE_TOTAL } from '../../types';
import OrderContext from './OrderContext';
import OrderReducer from './OrderReducer';

const OrderState = ({ children }) => {
    const initialState = {
        client: {},
        products: [],
        total: 0,
    };

    const [state, dispatch] = useReducer(OrderReducer, initialState);

    /**
     * Add client to state
     * @param {*} client Client selected
     */
    const addClient = (client) => {
        dispatch({
            type: SELECT_CLIENT,
            payload: client,
        });
    };

    /**
     * Add products to state
     * @param {*} products Products selected
     */
    const addProducts = (productsSelected) => {
        let newState;

        if (state.products.length > 0) {
            newState = productsSelected.map((product) => {
                const newObj = state.products.find((productState) => productState.id === product.id);
                return {
                    ...product,
                    ...newObj,
                };
            });
        } else {
            newState = productsSelected;
        }

        dispatch({
            type: SELECT_PRODUCT,
            payload: newState,
        });
    };

    /**
     * Modify product's amounts
     */
    const amoutProducts = (newProduct) => {
        dispatch({
            type: AMOUNT_PRODUCT,
            payload: newProduct,
        });
    };

    /**
     * Update total and calculate final amount
     */
    const updateTotal = () => {
        dispatch({
            type: UPDATE_TOTAL,
        });
    };

    return (
        <OrderContext.Provider
            value={{
                client: state.client,
                products: state.products,
                total: state.total,
                addClient,
                addProducts,
                amoutProducts,
                updateTotal,
            }}
        >
            {children}
        </OrderContext.Provider>
    );
};
export default OrderState;
