import mongoose from 'mongoose';

const { Schema } = mongoose;

const progressSchema = new Schema(
  {
    message: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const serviceContractSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    durationValue: {
      type: Number,
      required: true,
      min: 1,
    },
    durationUnit: {
      type: String,
      enum: ['days', 'months', 'years'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending',
    },
    uniqueKey: {
      type: String,
      unique: true,
      sparse: true,
    },
    progress: {
      type: [progressSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const ServiceContract = mongoose.model('ServiceContract', serviceContractSchema);

export default ServiceContract;

