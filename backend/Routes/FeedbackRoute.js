const router = require("express").Router();
const mongoose = require("mongoose");

const { Feedback, validateFeedback } = require("../Models/FeedbackModel");

// Ruta para obtener todos los comentarios
router.get("/", async (req, res) => {
  try {
    const comentarios = await Feedback.find(); // Obtenemos todos los comentarios
    res.json(comentarios); // Devolvemos los comentarios como JSON
  } catch (error) {
    console.error("Error al consultar comentarios en MongoDB:", error);
    res
      .status(500)
      .json({ error: "Error al consultar comentarios en MongoDB" });
  }
});

router.post("/", async (req, res) => {
  const newData = req.body;
  const { error } = validateFeedback(newData); // Validamos el comentario
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    // Verificar si ya existe un comentario igual
    const existingComment = await Feedback.findOne(newData);

    if (existingComment) {
      return res.status(400).json({ error: "Ya existe este comentario" });
    }

    const comentario = new Feedback(newData); // Creamos un nuevo comentario
    await comentario.save(); // Guardamos el comentario en MongoDB
    res.json(comentario); // Devolvemos el comentario creado como JSON
  } catch (error) {
    console.error("Error al guardar comentario en MongoDB:", error);
    res.status(500).json({ error: "Error al guardar comentario en MongoDB" });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const comentario = await Feedback.findByIdAndDelete(id); // Buscamos y eliminamos el comentario
    if (!comentario) {
      return res.status(404).json({ error: "Comentario no encontrado" });
    }
    res.json(comentario); // Devolvemos el comentario eliminado como JSON
  } catch (error) {
    console.error("Error al eliminar comentario en MongoDB:", error);
    res.status(500).json({ error: "Error al eliminar comentario en MongoDB" });
  }
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const newData = req.body;
  const { error } = validateFeedback(newData); // Validamos el comentario
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const comentario = await Feedback.findByIdAndUpdate(id, newData, {
      new: true,
    }); // Buscamos y actualizamos el comentario
    if (!comentario) {
      return res.status(404).json({ error: "Comentario no encontrado" });
    }
    res.json(comentario); // Devolvemos el comentario actualizado como JSON
  } catch (error) {
    console.error("Error al actualizar comentario en MongoDB:", error);
    res
      .status(500)
      .json({ error: "Error al actualizar comentario en MongoDB" });
  }
});

module.exports = router;
