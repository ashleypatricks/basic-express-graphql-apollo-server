import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
  },
  { timestamps: true }
);

const UserSchema = model('User', userSchema);

export { UserSchema };
