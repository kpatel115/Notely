// Authentication Resolvers
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
    AuthenticationError,
    ForbiddenError
} = require('apollo-server-express');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
require('dotenv').config();

const gravatar = require('gravatar');

// Module Export for Mutations 
module.exports = { 
    newNote: async (parent, args, { models, user }) => {
        // if no user on context, throw authentication error 
        if (!user) {
            throw new AuthenticationError('You must be signed in to create a note!');
        }
        try {
            const note = await models.Note.create({
                content: args.content,
            // reference the authors mongo id
                author: new ObjectId(user.id),
                timestamps: true
            })
            return note;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to create note.");
        }
    },
    deleteNote: async (parent,{ id }, { models , user }) => {
        // if not a user throw and auth error
        if(!user) {
            throw new AuthenticationError('You must be signed in to delete a note!');
        }
        // find the note
        const note = await models.Note.findById({_id: id});
        // if the note owner and curent user dont match, throw a forbidden error
        if (note && String(note.author) !== user.id) {
            throw new ForbiddenError('You dont have permissions to delete the note!');
        }
        // if everything looks good then remove the note
        try {
            await note.remove();
            return true;
        } catch(err){
            throw new Error(`Error deleting note: ${err}`);
            return false;
        }
    },
    updateNote: async (parent, {content, id }, { models, user }) => {
        // if note a user throw an uath error
        if(!user) {
            throw new AuthenticationError('You must be signed in to update the note!');
        }
        // find the note
        const note = await models.Note.findById(id);
        // if the note owenr and current user dont match throw a forbidden error
        if (note && String(note.author) !== user.id){
            throw new ForbiddenError('you dont have permissions to update the note!');
        }
        // udpate the note in the db and return the updated note
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
        // when first ran this token was recieved eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YmEzNTA0NDIzN2VkNDEzMzA2ODJhOCIsImlhdCI6MTcyMzQ3OTMwMH0.3s9xk9O-8m3SAMKSkFU8JlUXbP0a-1kYQahvWwR5kMw"
        // copy of token used: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YmEzNTA0NDIzN2VkNDEzMzA2ODJhOCIsImlhdCI6MTcyMzQ3OTMwMH0.3s9xk9O-8m3SAMKSkFU8JlUXbP0a-1kYQahvWwR5kMw
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
    }, 
    toggleFavorite: async (parent, { id }, { models, user }) => {
        // if no user context is passed throw an auth error
        if(!user) {
            throw new AuthenticationError();
        }
        // check to see if the user has already favorited the note
        let noteCheck = await models.Note.findById(id);
        const hasUser = noteCheck.favoritedBy.indexOf(new mongoose.Types.ObjectId(user.id));

        // If the user exists in the list
        // pull thme from the list and reduce the favoriteCount by 1
        if (hasUser >= 0){
            return await models.Note.findByIdAndUpdate(
                id,
                {
                    $pull: {
                        favoritedBy: new mongoose.Types.ObjectId(user.id)
                    },
                    $inc: {
                        favoriteCount: -1
                    }
                },
                {
                    // Set New to true to return the updated doc
                    new: true
                }
            );
            }  else {
                //if the user doesnt exist in the list 
                // add them to the list and increment the favoriteCount by 1
                return await models.Note.findByIdAndUpdate(
                    id,
                    {
                        $push: {
                            favoritedBy: new mongoose.Types.ObjectId(user.id)
                        },
                        $inc : {
                            favoriteCount: 1
                        }
                    },
                    {
                        new: true
                    }
                );
            }
        },
    };