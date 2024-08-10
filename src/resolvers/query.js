// Module Export for Query
module.exports = {
    notes: async () => {
        return await models.Note.find();
    },
    note: async (parent, args) => {
        return await models.Note.findById(args.id);
        // notes.find(note => note.id === args.id)
    }
};