// Authentication Resolvers
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
    AuthenticationError,
    ForbiddenError
} = require('apollo-server-express');
require('dotenv').config();

const gravatar = require('gravatar');

// Module Export for Mutations 
module.exports = { 
    newNote: async (parent, args, { models }) => {
        try {
            const note = await models.Note.create({
                content: args.content,
                author: "Adam Scott", // Hardcoding author for now, but this should be dynamic
                timestamps: true
            });
            return note;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to create note.");
        }
    },
    deleteNote: async (parent, args, { models }) => {
        try {
            await models.Note.findOneAndDelete({ _id: args.id});
            return true;
        } catch(err){
            throw new Error(`Error deleting note: ${err}`);

        }
    },
    updateNote: async (parent, {content, id }, { models }) => {
        return await models.Note.findOneAndUpdate(
            {
                _id: id,
            },
            {
                $set: {
                    content
                }
            },
            {
                new: true
            },
            {
                timestamps: true
            },
        );
    },
    signUp: async (parent, { username, email, password }, {models}) => {
        // Normalize Email Address
        email = email.trim().toLowerCase();
        // Hash the password
        const hashed = await bcrypt.hash(password, 10);
        // Create the Gravatar URL
        const avatar = gravatar.url(email, {s:'200', r: 'pg', d: 'identicon'});
        try {
            const user = await models.User.create({
                username,
                email,
                avatar,
                password: hashed
            });
            //create and return the JWT
            return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        } catch(err) {
            console.log(err);
            // if theres a problem creating the account throw and error
            throw new Error('Error creating account');
        }
        // when first ran this token was recieved yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YmEzNTA0NDIzN2VkNDEzMzA2ODJhOCIsImlhdCI6MTcyMzQ3OTMwMH0.3s9xk9O-8m3SAMKSkFU8JlUXbP0a-1kYQahvWwR5kMw"
    },
    signIn: async (parent, { username, email, password }, { models }) => {
        if (email) {
            // normalize email address
            email = email.trim().toLowerCase();
        }
        const user = await models.User.findOne({
            $or: [{ email}, { username }]
        });
        // if no user is found, throw an authentication error
        if (!user) {
            throw new AuthenticationError('Error signing in')
        }

        // if the passwords dont match throw and authetnication error
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            throw new AuthenticationError('Error signing in');
        }
        // create and return the json web token
        return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    }
};