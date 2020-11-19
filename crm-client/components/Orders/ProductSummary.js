import React, { useContext, useEffect, useState } from 'react';
import OrderContext from '../../context/Orders/OrderContext';

const ProductSummary = ({ product }) => {
    const { name, price } = product;

    // Order's Context
    const orderContext = useContext(OrderContext);
    const { amoutProducts, updateTotal } = orderContext;

    const [amout, setAmout] = useState(0);

    useEffect(() => {
        updateAmout();
        updateTotal();
    }, [amout]);

    const updateAmout = () => {
        const newProduct = { ...product, quantity: Number(amout) };
        amoutProducts(newProduct);
    };

    return (
        <div className="md:flex md:justify-between md:items-center mt-5">
            <div className="md:w-2/4 mb-2 md:mb-0">
                <p className="text-sm">{name}</p>
                <p>${price}</p>
            </div>
            <input
                type="number"
                placeholder="Cantidad"
                className="shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline md:ml-4"
                onChange={(e) => setAmout(e.target.value)}
                value={amout}
            />
        </div>
    );
};

export default ProductSummary;
