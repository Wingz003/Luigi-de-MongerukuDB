const { Schema, model } = require('mongoose');


const reactionSchema = new Schema(
  {
  reactionId: { type: Schema.Types.ObjectId },
  reactionBody: {
    type: String,
    required: true,
    maxlength: 280
  },
  username: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
},
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280
    },
    createdAt: {
      date: { type: Date, default: Date.now },

    },
    username: {
      type: String,
      required: true,
    },
    reactions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Thought',
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);
thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

const Thought = model('thought', thoughtSchema);
const Reaction = model('reaction', reactionSchema);



module.exports = { Thought, Reaction };
