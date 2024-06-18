import React from "react";
import "./Feedback.css";
import {
  selectToBD,
  createToBD,
  updateToBD,
  deleteByIDToBD,
  urlFeedbackBackend,
  ErrorAlert,
  SuccessAlert,
} from "../../GlobalVariables";

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "react-hook-form";
import { Modal } from "react-bootstrap";
import FeedbackEdit from "./FeedbackEdit";

function Feedback() {
  // -------------------------------------------------------------------
  // -- Para mostrar
  // -------------------------------------------------------------------
  const [feedbacktoDisplay, setFeedbacktoDisplay] = useState([]);
  const [alert, setAlert] = useState(false);

  // -------------------------------------------------------------------
  // -- Para inputs
  // -------------------------------------------------------------------
  const {
    register: inputFeedback,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm();

  const [handleCloseModal, setHandleCloseModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [idFeedback, setIdFeedback] = useState("");

  // -------------------------------------------------------------------
  // -- Funciones
  // -------------------------------------------------------------------

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    const response = await selectToBD(urlFeedbackBackend);
    setFeedbacktoDisplay(response);
  };

  const deleteFeedback = async (id) => {
    const response = await deleteByIDToBD(urlFeedbackBackend, id);
    setAlert(response);
    await fetchFeedback();
  };

  const createFeedback = async (newData) => {
    const response = await createToBD(urlFeedbackBackend, newData);
    setAlert(response);
    await fetchFeedback();
  };

  const clickEdit = (id) => {
    setIdFeedback(id);
    setShowModal(true);
  };

  const renderStars = (rating) => {
    const maxRating = 5;
    const filledStars = rating > 0 ? Math.floor(rating) : 0;

    const stars = [];
    for (let i = 0; i < maxRating; i++) {
      if (i < filledStars) {
        stars.push(
          <span key={i} className="star-color">
            ★
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="star-color ">
            ☆
          </span>
        );
      }
    }
    return stars;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // El mes es base 0, así que sumamos 1
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  return (
    <div>
      <span className="alerts-position-top">{alert}</span>

      <h1>Feedback</h1>

      <div>
        <div className="personalized-card">
          <div className="personalized-card2">
            <form
              className="personalized-form"
              onSubmit={handleSubmit(createFeedback)}
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
                          id={`star${value}`}
                          name="rate"
                          value={value}
                          {...inputFeedback("rating", { required: true })} // Selecciona el rating
                        />
                        <label
                          htmlFor={`star${value}`}
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
            </form>
          </div>
        </div>
      </div>

      <div className="feedback-card-container">
        {feedbacktoDisplay.map((feedback) => {
          return (
            <div key={feedback._id} className="personalized-card mt-4">
              <div className="personalized-card2">
                <div className="personalized-form">
                  <h2 className="feedback-date">
                    {formatDate(feedback.creationDate)}
                  </h2>
                  <p>{renderStars(feedback.rating)}</p>
                  <p>Comentario: {feedback.feedback}</p>

                  <div className="personalized-btn-container">
                    <button
                      className="personalized-button-edit"
                      onClick={() => clickEdit(feedback._id)}
                    >
                      Editar
                    </button>
                    <button
                      className="personalized-button-delete"
                      onClick={() => deleteFeedback(feedback._id)}
                    >
                      Borrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FeedbackEdit
            idFeedback={idFeedback}
            fetchFeedback={fetchFeedback}
            setAlert={setAlert}
            setShowModal={setShowModal}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Feedback;
