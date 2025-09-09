import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    instructor: {
      type: String,
      required: [true, "Instructor name is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
