export const getUserQuery = `
    query GetUser($email: String!) {
        user(by: { email: $email }) {
            id
            name
            email
            description
            avatarUrl
            githubUrl
            linkedInUrl
            }
        }
`;

export const createUserMutation = `
    mutation UserCreate($input: UserCreateInput!) {
        userCreate(input: $input) {
        user {
            name
            email
            avatarUrl
            description
            githubUrl
            linkedInUrl
            id
        }
        }
    }
`;
