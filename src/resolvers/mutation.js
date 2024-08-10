// Module Export for Mutations 
module.exports = { 
    newNote: async (parent, args, { models }) => {
        try {
            const note = await models.Note.create({
                content: args.content,
                author: "Adam Scott", // Hardcoding author for now, but this should be dynamic
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
    updateNote: async (parent, args, { models }) => {
        return await models.Note.findOneAndUpdate(
            {
                _id: args.id,
            },
            {
                $set: {
                    content
                }
            },
            {
                new: true
            }
        );
    },
};