// Module Export for Query
module.exports = {
    notes: async ( parents, args, { models}) => {
        return await models.Note.find();
    },
    note: async (parent, args, { models }) => {
        return await models.Note.findById(args.id);
        // notes.find(note => note.id === args.id)
    }
};