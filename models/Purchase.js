import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    purchaseDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

purchaseSchema.virtual("courseDetails", {
  ref: "Course",
  localField: "course",
  foreignField: "_id",
  justOne: true,
});

purchaseSchema.set("toJSON", { virtuals: true });
purchaseSchema.set("toObject", { virtuals: true });

export default mongoose.model("Purchase", purchaseSchema);
