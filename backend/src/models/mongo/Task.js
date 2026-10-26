import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters long'],
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: {
        values: ['todo', 'in_progress', 'completed'],
        message: 'Status must be todo, in_progress, or completed'
      },
      default: 'todo'
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: 'Priority must be low, medium, or high'
      },
      default: 'medium'
    },
    projectId: {
      type: Number,
      required: [true, 'Associated Project ID is required'],
      index: true
    },
    userId: {
      type: Number,
      required: [true, 'Associated User ID is required'],
      index: true
    },
    dueDate: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Compound index for efficient user filtering & pagination
taskSchema.index({ userId: 1, projectId: 1, status: 1, priority: 1 });

export const Task = mongoose.model('Task', taskSchema);
