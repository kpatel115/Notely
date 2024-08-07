const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');

const port = process.env.PORT || 4000;

let notes = [
    { id: '1', content: 'This is a note', author: "Adam Scott" },
    { id: '2', content: 'This is another note', author: "Harlow Everly" },
    { id: '3', content: 'This is the third note', author: "Riley Harrison" },
]
// Construct a schema, using GraphQL's Schema language
const typeDefs = gql`
    type Query {
        hello: String,
        notes: [Note!]
        note(id: ID!): Note
        },
    type Note{
        id: ID!
        content: String!
        author: String!
    },
    type Mutation {
        newNote(content: String!): Note!
    }
    `;

// Provide Resolver Functions for our schema fields
const resolvers = {
    Query: {
        hello: () => 'Hello World',
        notes: () => notes,
        note: (parent, args) => {
            return notes.find(note => note.id === args.id)
        }
    },
    Mutation: {
        newNote: (parent, args) => {
            let noteValue = {
                id: String(notes.length + 1),
                content: args.content,
                author: "Adam Scott"
            };
            notes.push(noteValue);
            return noteValue;
        }
    }
};

const app = express();

// Apollo Server Setup 
const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
    await server.start();
    // Apply the Apollo GraphQL middleware and set the path to /api
    server.applyMiddleware({ app, path: '/api' });
    app.listen(port, () => console.log(`GraphQL Server is running at http://localhost:${port}${server.graphqlPath}`));
}

startServer()