import { AMOUNT_PRODUCT, SELECT_CLIENT, SELECT_PRODUCT, UPDATE_TOTAL } from '../../types';

export default function (state, action) {
    switch (action.type) {
        case SELECT_CLIENT:
            return {
                ...state,
                client: action.payload,
            };

        case SELECT_PRODUCT:
            return {
                ...state,
                products: action.payload,
            };

        case AMOUNT_PRODUCT:
            return {
                ...state,
                products: state.products.map((product) =>
                    product.id === action.payload.id ? (product = action.payload) : product
                ),
            };

        case UPDATE_TOTAL:
            return {
                ...state,
                total: state.products.reduce((newTotal, product) => (newTotal += product.price * product.quantity), 0),
            };

        default:
            return state;
    }
}
