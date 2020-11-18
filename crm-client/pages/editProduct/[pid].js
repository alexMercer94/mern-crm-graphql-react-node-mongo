import { gql, useMutation, useQuery } from '@apollo/client';
import { Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';
import Swal from 'sweetalert2';
import * as Yup from 'yup';
import Layout from '../../components/Layout';

const GET_PRODUCT = gql`
    query getProduct($id: ID!) {
        getProduct(id: $id) {
            id
            name
            existence
            price
        }
    }
`;

const UPDATE_PRODUCT = gql`
    mutation updateProduct($id: ID!, $input: ProductInput) {
        updateProduct(id: $id, input: $input) {
            id
            name
            existence
            price
        }
    }
`;

const EditProduct = () => {
    const router = useRouter();
    const {
        query: { id },
    } = router;

    const { data, loading, error } = useQuery(GET_PRODUCT, {
        variables: {
            id,
        },
    });

    const [updateProduct] = useMutation(UPDATE_PRODUCT);

    const schemaValidation = Yup.object({
        name: Yup.string().required('El nombre del producto es obligatorio'),
        existence: Yup.number()
            .required('Agrega la cantidad disponible')
            .positive('No se acpetan números negativos')
            .integer('La existencia debe ser números enteros'),
        price: Yup.number().required('El precio es obligatorio').positive('No se aceptan números negativos'),
    });

    if (loading) return 'Cargando...';

    if (!data) {
        return 'Acción no permitida';
    }

    const handleSubmit = async (values) => {
        const { name, existence, price } = values;

        try {
            const { data } = await updateProduct({
                variables: {
                    id,
                    input: {
                        name,
                        existence,
                        price,
                    },
                },
            });

            Swal.fire('Actualizado!', 'El producto se actualizó correctamente', 'success');
            router.push('/products');
        } catch (error) {
            console.log(error);
        }
    };

    const { getProduct } = data;

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Editar Producto</h1>
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <Formik
                        validationSchema={schemaValidation}
                        enableReinitialize
                        initialValues={getProduct}
                        onSubmit={(values) => handleSubmit(values)}
                    >
                        {(props) => {
                            return (
                                <form
                                    className="bg-white rounded shadown-md px-8 pt-6 pb-8 mb-4"
                                    onSubmit={props.handleSubmit}
                                >
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                            Nombre
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="name"
                                            type="text"
                                            placeholder="Nombre Producto"
                                            value={props.values.name}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>
                                    {props.touched.name && props.errors.name ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.name}</p>
                                        </div>
                                    ) : null}
                                    <div className="mb-4">
                                        <label
                                            className="block text-gray-700 text-sm font-bold mb-2"
                                            htmlFor="existence"
                                        >
                                            Cantidad Disponible
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="existence"
                                            type="number"
                                            placeholder="Cantidad Disponible"
                                            value={props.values.existence}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>
                                    {props.touched.surname && props.errors.surname ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.surname}</p>
                                        </div>
                                    ) : null}
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                                            Precio
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="price"
                                            type="number"
                                            placeholder="Precio Producto"
                                            value={props.values.price}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>
                                    {props.touched.company && props.errors.company ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.company}</p>
                                        </div>
                                    ) : null}
                                    <input
                                        type="submit"
                                        className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                                        value="Guardar Cambios"
                                    />
                                </form>
                            );
                        }}
                    </Formik>
                </div>
            </div>
        </Layout>
    );
};

export default EditProduct;
