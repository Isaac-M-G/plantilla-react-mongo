import React from "react";
import { ErrorAlert } from "../../GlobalVariables";
import { v4 as uuidv4 } from "uuid";

function FeedbackForm({ handleSubmit, createFeedback, inputFeedback, errors }) {
  return (
    <div>
      <form
        className="personalized-form"
        onSubmit={handleSubmit(createFeedback)}
      >
        <h2>Comentar</h2>

        <div className="star-container">
          <div className="ratingStar">
            {[...Array(5)].map((_, index) => {
              const value = 5 - index; // Valor del rating, comenzando desde 5 y decrementando
              const uniqueId = `star-${value}-${uuidv4()}`; // Generar un ID único

              return (
                <React.Fragment key={value}>
                  <input
                    type="radio"
                    id={uniqueId}
                    name="rate"
                    value={value}
                    {...inputFeedback("rating", { required: true })} // Selecciona el rating
                  />
                  <label
                    htmlFor={uniqueId}
                    title={`Rating ${value}` + uuidv4()}
                  ></label>
                </React.Fragment>
              );
            })}
          </div>
        </div>
        {errors.rating?.type === "required" && (
          <ErrorAlert
            key={uuidv4()}
            message="Debe seleccionar una calificación"
          />
        )}

        <div className="personalized-field">
          <textarea
            required
            type="text"
            className="personalized-input-field"
            placeholder="Comentario"
            {...inputFeedback("feedback", {
              required: true,
              maxLength: 1000,
              minLength: 5,
            })}
          />
        </div>
        {errors.feedback?.type === "minLength" && (
          <ErrorAlert
            key={uuidv4()}
            message="El comentario debe tener al menos 5 caracteres"
          />
        )}
        {errors.feedback?.type === "maxLength" && (
          <ErrorAlert
            key={uuidv4()}
            message="El comentario debe tener menos de 1000 caracteres"
          />
        )}
        <button type="submit" className="personalized-button-create mt-4 mb-4">
          Crear
        </button>
      </form>
    </div>
  );
}

export default FeedbackForm;
