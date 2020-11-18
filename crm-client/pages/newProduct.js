import { gql, useMutation } from '@apollo/client';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';
import Swal from 'sweetalert2';
import * as Yup from 'yup';
import Layout from '../components/Layout';

const NEW_PRODUCT = gql`
    mutation newProduct($input: ProductInput) {
        newProduct(input: $input) {
            id
            name
            existence
            price
        }
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

const NewProduct = () => {
    const router = useRouter();

    const [newProduct] = useMutation(NEW_PRODUCT, {
        update(cache, { data: { newProduct } }) {
            // Get cache's object
            const { getProducts } = cache.readQuery({ query: GET_PRODUCTS });

            // Rewrite cache
            cache.writeQuery({
                query: GET_PRODUCTS,
                data: {
                    getProducts: [...getProducts, newProduct],
                },
            });
        },
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            existence: '',
            price: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('El nombre del producto es obligatorio'),
            existence: Yup.number()
                .required('Agrega la cantidad disponible')
                .positive('No se acpetan números negativos')
                .integer('La existencia debe ser números enteros'),
            price: Yup.number().required('El precio es obligatorio').positive('No se aceptan números negativos'),
        }),
        onSubmit: async (values) => {
            const { name, existence, price } = values;

            try {
                const { data } = await newProduct({
                    variables: {
                        input: {
                            name,
                            existence,
                            price,
                        },
                    },
                });

                router.push('/products');
                Swal.fire('Creando!', 'Se creó el producto correctamente', 'success');
            } catch (error) {
                console.log(error);
            }
        },
    });

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Crear Nuevo Producto</h1>
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <form className="bg-white rounded shadown-md px-8 pt-6 pb-8 mb-4" onSubmit={formik.handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                Nombre
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="name"
                                type="text"
                                placeholder="Nombre Producto"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.name && formik.errors.name ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.name}</p>
                            </div>
                        ) : null}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="existence">
                                Cantidad Disponible
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="existence"
                                type="number"
                                placeholder="Cantidad Disponible"
                                value={formik.values.existence}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.existence && formik.errors.existence ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.existence}</p>
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
                                value={formik.values.price}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.price && formik.errors.price ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.price}</p>
                            </div>
                        ) : null}
                        <input
                            type="submit"
                            className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                            value="Agregar Nuevo Producto"
                        />
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default NewProduct;
