import React from "react";
import {
  selectToBD,
  createToBD,
  updateToBD,
  deleteByIDToBD,
  urlFeedbackBackend,
  ErrorAlert,
  SuccessAlert,
} from "../../GlobalVariables";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "react-hook-form";

const FeedbackEdit = ({
  idFeedback,
  setAlert,
  fetchFeedback,
  setShowModal,
  handleCloseModal,
}) => {
  // -------------------------------------------------------------------
  // -- Para inputs
  // -------------------------------------------------------------------
  const {
    register: inputFeedback,
    formState: { errors },
    handleSubmit,
  } = useForm();

  // -------------------------------------------------------------------
  // -- Funciones
  // -------------------------------------------------------------------
  const updateFeedback = async (newData) => {
    const response = await updateToBD(urlFeedbackBackend, idFeedback, newData);
    setAlert(response);
    await fetchFeedback();
    setShowModal(false);
  };

  return (
    <div>
      <form
        className="personalized-form"
        onSubmit={handleSubmit(updateFeedback)}
      >
        <h2>Comentar</h2>

        <div className="star-container">
          <div className="ratingStar">
            {[...Array(5)].map((_, index) => {
              const value = 5 - index; // Valor del rating, comenzando desde 5 y decrementando
              return (
                <React.Fragment key={value}>
                  <input
                    type="radio"
                    id={`staredit${value}`}
                    name="rate"
                    value={value}
                    {...inputFeedback("rating", { required: true })} // Selecciona el rating
                  />
                  <label
                    htmlFor={`staredit${value}`}
                    title={`Rating ${value}`}
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
          <input
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
        <button type="submit" className="personalized-button-create">
          Crear
        </button>
        <button
          className="personalized-button-delete"
          onClick={handleCloseModal}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default FeedbackEdit;
