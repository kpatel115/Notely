// Module Export for Query
module.exports = {
    // add the following to the existing module.exports object
    notes: async ( parents, args, { models}) => {
        return await models.Note.find().limit(100);
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
    },
    noteFeed: async (parent, { cursor }, { models }) => {
        //hardcode the limit to 10 items
        const limit = 10;
        // set the default hasNextPage value to false
        let hasNextPage = false;
        // if no cursor is passed the default query will be empty 
        // this will pull the newest notes from the db 
        let cursorQuery = {};

        // if there is a cursor 
        // our query will look for notes with an ObjectId less than that of the cursor
        if (cursor) {
            cursorQuery = { _id: { $lt: cursor } };
        }
        // find limit of +1 notes in db, sort new to old 
        let notes = await models.Note.find(cursorQuery)
            .sort({ _id: -1 })
            .limit(limit + 1);

            // if num notes found exceeds limit
        if (notes.length > limit) {
            hasNextPage = true;
            notes.notes.slice(0, -1);
        }
        // new cursor will be mongo object ID of last item in feed array
        const newCursor = notes[notes.length - 1]._id;

        return {
            notes,
            cursor: newCursor,
            hasNextPage
        };
    },
};