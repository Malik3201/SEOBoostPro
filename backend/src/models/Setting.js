import mongoose from 'mongoose';

const { Schema } = mongoose;

const settingSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    value: {
      type: Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Setting = mongoose.model('Setting', settingSchema);

export default Setting;

