// Express
const express = require('express');
// Apollo Server and GraphQL + typeDefs Schema
const { ApolloServer} = require('apollo-server-express');
//DotENV
require('dotenv').config();
// Local Module Imports
// MongoDB and Models
const db = require('./src/db');
const models = require('./src/models/index')
const typeDefs = require('./src/schema');
const resolvers= require('./src/resolvers/index')
// JWT
const jwt = require('jsonwebtoken');
// Middlware Express Helmet
const helmet = require('helment');
// Port assignment
const port = process.env.PORT || 4000;
// MongoDB Connection String
const DB_HOST = process.env.MONGODB_URI;

// Hardcoded Data used in GraphQL Sandbox - deleted for space 
// Construct a schema, using GraphQL's Schema language - imported through schema.js
// Provide Resolver Functions for our schema fields - refactored to resolvers folder

// Code starts to function here
const app = express();
// use helment early in our middleware stack
app.use(helmet());

// Calling Connection
db.connect(DB_HOST);

// get the user info from a JWT
const getUser = token => {
    if(token) {
        try {
            // return the user info from the token
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch(err) {
            // if theres a probelm with the token, throw and error
            throw new Error('Session invalid - Token error');
        }
    }
};
// Apollo Server Setup 
const server = new ApolloServer({ 
    typeDefs, 
    resolvers,
    context: ({ req }) => {
        // get user token from headers
        const token = req.headers.authorization;
        // try to retrive a user with the token
        const user = getUser(token);
        // for now lets log the user to the console
        console.log(user);
        // add db models and the user to the context
    return { models, user };
    } 
});

async function startServer() {
    await server.start();
    // Apply the Apollo GraphQL middleware and set the path to /api
    server.applyMiddleware({ app, path: '/api' });
    app.listen(port, () => console.log(`GraphQL Server is running at http://localhost:${port}${server.graphqlPath}`));
}

startServer()