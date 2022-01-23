
module.exports = {
    createThought(req, res) {
        Thought.create(req.body)
            .then((thought) => res.json(thought))
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
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
}