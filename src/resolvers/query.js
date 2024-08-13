// Module Export for Query
module.exports = {
    // add the following to the existing module.exports object
    notes: async ( parents, args, { models}) => {
        return await models.Note.find();
    },
    note: async (parent, args, { models }) => {
        return await models.Note.findById(args.id);
        // notes.find(note => note.id === args.id)
    },
    user: async (parent, { username }, { models }) => {
        // find a user given their username
        return await models.User.findOne({ username });
    },
    users: async (parent, args, { models }) => {
        // Find all users
        return await models.User.find();
    },
    me: async (parent, args, { models, user }) => {
        // find a user given the current user context
        return await models.User.findById(user.id);
    }
};