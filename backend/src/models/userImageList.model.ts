import { Schema, model, Types, Document } from "mongoose";

export interface IUserImageList extends Document {
  userId: Types.ObjectId;
  imageIds: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userImageListSchema = new Schema<IUserImageList>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    imageIds: [{ type: Schema.Types.ObjectId, ref: "Image", required: true }],
  },
  { timestamps: true }
);

export default model<IUserImageList>("UserImageList", userImageListSchema);
