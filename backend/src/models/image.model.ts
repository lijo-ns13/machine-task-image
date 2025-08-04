import mongoose, { Document, Schema, Types } from "mongoose";

export interface IImage extends Document {
  _id: Types.ObjectId;
  title: string;
  userId: Types.ObjectId;
  s3key: string;
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
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    s3key: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IImage>("Image", imageSchema);
