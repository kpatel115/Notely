// Module Export for Mutations 
module.exports = { 
    newNote: async (parent, args) => {
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
    }
};