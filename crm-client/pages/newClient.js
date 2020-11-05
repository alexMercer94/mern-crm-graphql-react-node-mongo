import { gql, useMutation } from '@apollo/client';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import * as Yup from 'yup';
import Layout from '../components/Layout';

const NEW_CLIENT = gql`
    mutation newClient($input: ClientInput) {
        newClient(input: $input) {
            id
            name
            surname
            company
            email
            phone
        }
    }
`;

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

const NewClient = (props) => {
    const [message, setMessage] = useState(null);
    const router = useRouter();
    // Mutatio in order to create new clients
    const [newClient] = useMutation(NEW_CLIENT, {
        update(cache, { data: { newClient } }) {
            // Get cache's object
            const { getClientsSeller } = cache.readQuery({ query: GET_CLIENTS_SELLER });

            // Rewrite cache
            cache.writeQuery({
                query: GET_CLIENTS_SELLER,
                data: {
                    getClientsSeller: [...getClientsSeller, newClient],
                },
            });
        },
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            surname: '',
            company: '',
            email: '',
            phone: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('El nombre del cliente es obligatorio'),
            surname: Yup.string().required('El apellido del cliente es obligatorio'),
            company: Yup.string().required('El campo de empresa del cliente es obligatorio'),
            email: Yup.string().email('El email no es válido').required('El email del cliente es obligatorio'),
        }),
        onSubmit: async (values) => {
            const { name, surname, company, email, phone } = values;
            try {
                const { data } = await newClient({
                    variables: {
                        input: {
                            name,
                            surname,
                            company,
                            email,
                            phone,
                        },
                    },
                });

                router.push('/');
            } catch (error) {
                setMessage(error.message);
                setTimeout(() => {
                    setMessage(null);
                }, 3000);
            }
        },
    });

    /**
     * Show a message
     */
    const showMessage = () => {
        return (
            <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{message}</p>
            </div>
        );
    };

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Nuevo Cliente</h1>
            {message && showMessage()}
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
                                placeholder="Nombre Cliente"
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
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="surname">
                                Apellido
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="surname"
                                type="text"
                                placeholder="Apellido Cliente"
                                value={formik.values.surname}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.surname && formik.errors.surname ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.surname}</p>
                            </div>
                        ) : null}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="company">
                                Empresa
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="company"
                                type="text"
                                placeholder="Empresa Cliente"
                                value={formik.values.company}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.company && formik.errors.company ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.company}</p>
                            </div>
                        ) : null}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="email"
                                type="email"
                                placeholder="Email Cliente"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.email && formik.errors.email ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.email}</p>
                            </div>
                        ) : null}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                                Teléfono
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="phone"
                                type="tel"
                                placeholder="Telefono Cliente"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        <input
                            type="submit"
                            className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                            value="Registrar Cliente"
                        />
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default NewClient;
