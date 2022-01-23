const { Thought } = require('../models/Thought');

module.exports = {

    getThoughts(req, res) {
        Thought.find()
            .then((thoughts) => res.json(thoughts))
            .catch((err) => res.status(500).json(err));
    },
   
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .select('-__v')
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought with that ID' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
  
    createThought(req, res) {
        Thought.create(req.body)
            .then((thought) => res.json(thought))
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    // Delete a course
    deleteThought(req, res) {
        Thought.findOneAndDelete({ __v: req.params.thoughtId })
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No course with that ID' })
                    : Thought.deleteMany({ _id: { $in: thought.users } })
            )
            .then(() => res.json({ message: 'Thought and user deleted!' }))
            .catch((err) => res.status(500).json(err));
    },
    // Update a course
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { __v: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No course with this id!' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    }
};

