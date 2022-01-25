const { Thought, Reaction } = require('../models/Thought');
const { User } = require('../models');

const ObjectId = require('mongoose').Types.ObjectId;

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
            .then((thought) => {
                !thought
                    ? res.status(500).json({
                        message: 'Thought not created',
                    })
                    :
                    User.findOneAndUpdate(
                        { username: thought.username },
                        { $addToSet: { thoughts: thought._id } },
                        { new: true }
                    )
                        .then((user) => {
                            !user
                                ? res.status(404).json({ message: 'Thought created but user not found!' })
                                : res.status(201).json(thought)
                        })
                        .catch((err) => {
                            console.log(err);
                            return res.status(500).json(err);
                        });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },
    // Delete a course
    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
            .then(() => {
                User.findOneAndUpdate(
                    { thoughts: req.params.thoughtId },
                    { $pull: { thoughts: req.params.thoughtId } },
                    { new: true }
                )
                    .then((user) => {
                        !user
                            ? res.status(404).json({ message: 'Thought deleted but user not found!' })
                            : res.status(200).json(user)
                    })
                    .catch((err) => {
                        console.log(err);
                        return res.status(500).json(err);
                    });
            }).catch((err) => res.status(500).json(err));
    },
    // Update a course
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought with this id!' })
                    : res.status(200).json({ message: 'Thought has been updated!' })
            )
            .catch((err) => res.status(500).json(err));
    },
    createReaction(req, res) {
        Reaction.create(req.body)
            .then((reaction) => {
                !reaction
                    ? res.status(500).json({
                        message: 'Reaction not created',
                    })
                    :
                    Thought.findOneAndUpdate(
                        { _id: req.params.thoughtId },
                        { $addToSet: { reactions: reaction._id } },
                        { new: true }
                    )
                        .then((thought) => {
                            !thought
                                ? res.status(404).json({ message: 'Reaction created but thought not found!' })
                                : res.status(201).json(reaction)
                        })
                        .catch((err) => {
                            console.log(err);
                            return res.status(500).json(err);
                        });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },
    // Delete a course
    deleteReaction(req, res) {
        Reaction.findOneAndRemove({ _id: req.params.reactionId })
            .then(() => {
                Thought.findOneAndUpdate(
                    { _id: req.params.thoughtId },
                    { $pull: { reactions: req.params.reactionId } },
                    { new: true }
                )
                    .then((thought) => {
                        !thought
                            ? res.status(404).json({ message: 'Reaction deleted but thought not found!' })
                            : res.status(200).json({ message: 'Reaction deleted and removed from thought!' })
                    })
                    .catch((err) => {
                        console.log(err);
                        return res.status(500).json(err);
                    });
            }).catch((err) => res.status(500).json(err));
    },
};

