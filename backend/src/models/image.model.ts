import mongoose, { Document, Schema, Types } from "mongoose";

export interface IImage extends Document {
  _id: Types.ObjectId;
  title: string;
  s3key: string;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}
const imageSchema = new Schema<IImage>(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
    },
    s3key: {
      type: String,
      required: true,
    },
    position: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IImage>("Image", imageSchema);
