// Apollo Server and GraphQL + typeDefs Schema
const { ApolloServer, gql } = require('apollo-server-express');
const typeDefs = require('./src/schema');
// Express
const express = require('express');
//DotENV
require('dotenv').config();
// MongoDB and Models
const db = require('./src/db');
const models = require('./src/models')
const DB_HOST = process.env.MONGODB_URI;
// Port assignment
const port = process.env.PORT || 4000;

// Hardcoded Data used in GraphQL Sandbox - deleted for space 

// Construct a schema, using GraphQL's Schema language - imported through schema.js

// Provide Resolver Functions for our schema fields - refactored to resolvers folder

const app = express();

// Calling Connection
db.connect(DB_HOST);

// Apollo Server Setup 
const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
    await server.start();
    // Apply the Apollo GraphQL middleware and set the path to /api
    server.applyMiddleware({ app, path: '/api' });
    app.listen(port, () => console.log(`GraphQL Server is running at http://localhost:${port}${server.graphqlPath}`));
}

startServer()