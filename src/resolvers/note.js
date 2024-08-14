module.exports = {
    //resolve the author info for a note when erequirest
    author: async (note, args, { models }) => {
        return await models.User.findById(note.author);
    }, 
    // resolved the favoritedBy infor for a ntoe when required
    favoritedBy: async (note, args, {models}) => {
        return await models.User.find({ _id: { $in: note.favoritedBy } });
    }
};