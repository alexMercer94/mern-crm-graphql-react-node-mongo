import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import React from 'react';

const GET_USER = gql`
    query getUser {
        getUser {
            id
            name
            surname
        }
    }
`;

const Header = () => {
    const router = useRouter();

    // Query apollo
    const { data, loading, error } = useQuery(GET_USER);

    if (loading) return null;

    if (!data.getUser) {
        router.push('/login');
    }

    const { name, surname } = data.getUser;

    /**
     * Close session
     */
    const closeSession = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <div className="flex justify-between mb-6">
            <p className="mr-2">
                Hola: {name} {surname}
            </p>
            <button
                className="bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md"
                type="button"
                onClick={() => closeSession()}
            >
                Cerrar sesión
            </button>
        </div>
    );
};

export default Header;
