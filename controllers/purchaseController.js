import Purchase from "../models/Purchase.js";
import Course from "../models/Course.js";
import Joi from "joi";

const purchaseSchema = Joi.object({
  courseId: Joi.string().required(),
});

const purchaseCourse = async (req, res) => {
  try {
    const { error } = purchaseSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });
    const { courseId } = req.body;
    const userId = req.userId;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    const existingPurchase = await Purchase.findOne({
      user: userId,
      course: courseId,
    });
    if (existingPurchase)
      return res.status(400).json({ message: "Course already purchased" });
    const purchase = await Purchase.create({
      user: userId,
      course: courseId,
      amount: course.price,
      purchaseDate: new Date(),
    });
    await purchase.populate("course");
    res.status(201).json({ success: true, data: purchase });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyPurchases = async (req, res) => {
  try {
    const userId = req.userId;
    const purchases = await Purchase.find({ user: userId }).populate(
      "course",
      "title description price instructor"
    );
    res.json({ success: true, data: purchases });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { purchaseCourse, getMyPurchases };
