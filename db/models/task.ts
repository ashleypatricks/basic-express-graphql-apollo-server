import { Schema, model } from 'mongoose';

const taskSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      required: true,
    },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const TaskSchema = model('Task', taskSchema);

export { TaskSchema };
