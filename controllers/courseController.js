import Course from "../models/Course.js";
import Joi from "joi";

const courseSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().min(0).required(),
  instructor: Joi.string().required(),
});

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().select("-__v");
    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCourse = async (req, res) => {
  try {
    const { error } = courseSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json({ success: true, message: "Course deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getAllCourses, getCourseById, createCourse, deleteCourse };
