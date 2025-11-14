import mongoose from 'mongoose';

const { Schema } = mongoose;

const reportSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    pageSpeed: {
      type: Schema.Types.Mixed,
      default: {},
    },
    meta: {
      type: Schema.Types.Mixed,
      default: {},
    },
    suggestions: {
      type: [String],
      default: [],
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ['queued', 'done', 'failed'],
      default: 'queued',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const Report = mongoose.model('Report', reportSchema);

export default Report;

