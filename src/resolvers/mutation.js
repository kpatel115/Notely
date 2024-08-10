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
    deleteNote: async (parent, { id }, { models }) => {
        try {
            await models.Note.findOneAndRemove({ _id: id});
            return true;
        } catch(err){
            return false;
        }
    },
};