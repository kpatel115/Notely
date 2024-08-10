const { gql } = require('apollo-server-express');

module.exports = gql`
    scalar DateTime
    ... 
    
    type Note {
        id: ID!
        content: String!
        author: String!
        createAt: DateTime!
        updatedAt: DateTime!
    }
    
    type Query {
        notes: [Note!]
        note(id: ID!): Note
    }

    type Mutation {
        newNote(content: String!): Note!
        updateNote(id: ID!, content: String!): Note!
        deleteNote(id: ID!): Boolean
    }
`;
