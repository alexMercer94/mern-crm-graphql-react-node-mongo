import { gql, useMutation, useQuery } from '@apollo/client';
import { Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';
import Swal from 'sweetalert2';
import * as Yup from 'yup';
import Layout from '../../components/Layout';

const GET_CLIENT = gql`
    query getClient($id: ID!) {
        getClient(id: $id) {
            id
            name
            surname
            email
            phone
            company
        }
    }
`;

const UPDATE_CLIENT = gql`
    mutation updateClient($id: ID!, $input: ClientInput) {
        updateClient(id: $id, input: $input) {
            id
            name
            company
        }
    }
`;

const EditClient = () => {
    const router = useRouter();
    const {
        query: { id },
    } = router;

    const { data, loading, error } = useQuery(GET_CLIENT, {
        variables: {
            id,
        },
    });

    const [updateClient] = useMutation(UPDATE_CLIENT);

    const schemaValidation = Yup.object({
        name: Yup.string().required('El nombre del cliente es obligatorio'),
        surname: Yup.string().required('El apellido del cliente es obligatorio'),
        company: Yup.string().required('El campo de empresa del cliente es obligatorio'),
        email: Yup.string().email('El email no es válido').required('El email del cliente es obligatorio'),
    });

    if (loading) return 'Cargando...';

    const { getClient } = data;

    const handleSubmit = async (values) => {
        const { name, surname, company, email, phone } = values;

        try {
            const { data } = await updateClient({
                variables: {
                    id,
                    input: {
                        name,
                        surname,
                        company,
                        email,
                        phone,
                    },
                },
            });

            Swal.fire('Actualizado!', 'El cliente de actualizó correctamente', 'success');
            router.push('/');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Editar Cliente</h1>
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <Formik
                        validationSchema={schemaValidation}
                        enableReinitialize
                        initialValues={getClient}
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
                                            placeholder="Nombre Cliente"
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
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="surname">
                                            Apellido
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="surname"
                                            type="text"
                                            placeholder="Apellido Cliente"
                                            value={props.values.surname}
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
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="company">
                                            Empresa
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="company"
                                            type="text"
                                            placeholder="Empresa Cliente"
                                            value={props.values.company}
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
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                            Email
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="email"
                                            type="email"
                                            placeholder="Email Cliente"
                                            value={props.values.email}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>
                                    {props.touched.email && props.errors.email ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.email}</p>
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
                                            value={props.values.phone}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>
                                    <input
                                        type="submit"
                                        className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                                        value="Editar Cliente"
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

export default EditClient;
