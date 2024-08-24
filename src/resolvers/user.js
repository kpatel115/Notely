module.exports = {
    notes: async (user, args, { models }) => {
        return await models.Note.find({ author: user._id }).sort({ _id });
    },
    favorites: async (user, args, { models }) => {
        return await models.Note.find({ favoritedBy: user._id }).sort({ _id});
    }
}