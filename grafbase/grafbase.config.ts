import { g, auth, config } from '@grafbase/sdk';

// @ts-ignore
const User = g
    .model('User', {
        name: g.string().length({ min: 3, max: 20 }),
        email: g.string().unique(),
        avatarUrl: g.url(),
        description: g.string().optional(),
        githubUrl: g.url().optional(),
        linkedInUrl: g.url().optional(),
        twitterUrl: g.url().optional(),
        projects: g
            .relation(() => Project)
            .list() // a user can have many projects or none
            .optional(),
    })
    .auth((rules) => {
        // every user can read users data
        rules.public().read();
    });

// @ts-ignore
const Project = g
    .model('Project', {
        title: g.string().length({ min: 3 }),
        description: g.string(),
        image: g.url(),
        liveSiteUrl: g.url(),
        githubUrl: g.url(),
        category: g.string().search(),
        createdBy: g.relation(() => User), // a project must have a user
    })
    .auth((rules) => {
        // every user can read projects data
        rules.public().read();
        // only authenticated users can create, update and delete projects
        rules.private().create().delete().update();
    });

const jwt = auth.JWT({
    issuer: 'grafbase',
    secret: g.env('NEXTAUTH_SECRET'),
});

// final object to return
// all functionalities of our app are private
export default config({
    schema: g,
    auth: {
        providers: [jwt],
        rules: (rules) => rules.private(),
    },
});
