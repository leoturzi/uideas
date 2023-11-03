import { ProjectForm } from '@/common.types';
import {
    createUserMutation,
    getUserQuery,
    createProjectMutation,
} from '@/graphql';
import { GraphQLClient } from 'graphql-request';

const isProduction = process.env.NODE_ENV === 'production';

const apiUrl = isProduction
    ? process.env.NEXT_PUBLIC_GRAFBASE_API_URL || ''
    : 'http://127.0.0.1:4000/graphql';

const apiKey = isProduction
    ? process.env.NEXT_PUBLIC_GRAFBASE_API_KEY || ''
    : 'letmain';

const serverUrl = isProduction
    ? process.env.NEXT_PUBLIC_SERVER_URL || ''
    : 'http://localhost:3000';

// a client is a connection to the graphql server
const client = new GraphQLClient(apiUrl);

const makeGraphQLRequest = async (query: string, variables = {}) => {
    try {
        return await client.request(query, variables);
    } catch (error: any) {
        console.log(error);
    }
};

export const getUser = async (email: string) => {
    client.setHeader('x-api-key', apiKey);
    return makeGraphQLRequest(getUserQuery, { email });
};

export const createUser = async (
    name: string,
    email: string,
    avatarUrl: string
) => {
    client.setHeader('x-api-key', apiKey);
    const variables = {
        input: {
            name,
            email,
            avatarUrl,
        },
    };

    return makeGraphQLRequest(createUserMutation, variables);
};

export const fetchToken = async () => {
    try {
        const response = await fetch(`${serverUrl}/api/auth/token`);
        return response.json();
    } catch (error) {
        throw error;
    }
};

const uploadImage = async (imagePath: string) => {
    try {
        const response = await fetch(`${serverUrl}/api/upload`, {
            method: 'POST',
            body: JSON.stringify({ path: imagePath }),
        });

        return response.json();
    } catch (error) {
        throw error;
    }
};

export const createNewProject = async (
    form: ProjectForm,
    creatorId: string,
    token: string
) => {
    const imageUrl = await uploadImage(form.image);

    if (imageUrl.url) {
        // we use token to ensure that only logged in users can create projects
        client.setHeader('Authorization', `Bearer ${token}`);
        const variables = {
            input: {
                ...form,
                image: imageUrl.url,
                createdByd: {
                    link: creatorId,
                },
            },
        };
        return makeGraphQLRequest(createProjectMutation, variables);
    }
};
