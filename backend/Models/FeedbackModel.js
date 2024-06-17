const mongoose = require("mongoose");
const Joi = require("joi");

/**
 * Modelo de feedback.
 */
const feedbackSchema = new mongoose.Schema(
  {
    feedback: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    creationDate: { type: Date, default: Date.now },
    // user: {
    //   type: mongoose.Schema.Types.ObjectId, // Cambia de String a ObjectId
    //   ref: "User", // Referencia a la colección de usuarios
    //   required: false,
    // },
  },
  { strict: "throw" }
);

const validateFeedback = (data) => {
  const schema = Joi.object({
    // Esquema de validación
    feedback: Joi.string().required().label("Feedback"),
    rating: Joi.number().integer().min(1).max(5).required().label("Rating"),
  });
  return schema.validate(data);
};

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = { Feedback, validateFeedback };
