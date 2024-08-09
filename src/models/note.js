// Mongoose Schema
// Define the note;s database schema
const noteSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true
        },
        author: {
            type: String,
            required: true
        }
    },
    {
        //Assings createAt and updatedAt fields with a Date type
        Timestamps: true
    }
);

// Define the Note  model with the schema
const Note = mongoose.model('Note', noteSchema);
// Export the module
module.exports = Note;
