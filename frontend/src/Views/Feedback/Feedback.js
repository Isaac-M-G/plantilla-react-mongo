import React from "react";
import "./Feedback.css";
import {
  selectToBD,
  createToBD,
  deleteByIDToBD,
  urlFeedbackBackend,
} from "../../GlobalVariables";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "react-bootstrap";
import FeedbackEdit from "./FeedbackEdit";
import FeedbackForm from "./FeedbackForm";

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

  const [showModal, setShowModal] = useState(false);
  const [InfoFeedback, setInfoFeedback] = useState("");

  // -------------------------------------------------------------------
  // -- Funciones
  // -------------------------------------------------------------------

  useEffect(() => {
    fetchFeedback();
  }, []);

  /**
   * Función que obtiene los feedbacks de la base de datos
   * y los guarda en el estado feedbacktoDisplay
   */
  const fetchFeedback = async () => {
    const response = await selectToBD(urlFeedbackBackend);
    setFeedbacktoDisplay(response);
  };

  /**
   * Función que elimina un feedback de la base de datos
   * @param {string} id - id del feedback a borrar
   */
  const deleteFeedback = async (id) => {
    const response = await deleteByIDToBD(urlFeedbackBackend, id);
    setAlert(response);
    await fetchFeedback();
  };

  /**
   * Función que crea un nuevo feedback en la base de datos
   * @param {Object} newData - Objeto con los datos del nuevo feedback
   */
  const createFeedback = async (newData) => {
    const response = await createToBD(urlFeedbackBackend, newData);
    setAlert(response);
    await fetchFeedback();
  };

  /**
   * Función que abre el modal para editar un feedback
   * @param {Object} FeedbackInfo - Objeto con la información del feedback a editar
   */
  const clickEdit = (FeedbackInfo) => {
    setInfoFeedback(FeedbackInfo);
    setShowModal(true);
  };

  /**
   * Función que cierra el modal
   * @param {boolean} handleCloseModal
   */
  const handleCloseModal = () => {
    setShowModal(false);
  };

  /**
   * Función que renderiza las estrellas de acuerdo a la calificación
   * @param {number} rating
   * @returns {Array} - Array con las estrellas
   */
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

  /**
   * Función que formatea la fecha en formato dd/mm/yyyy
   * @param {string} dateString
   * @returns {string} - Fecha formateada
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // El mes es base 0, así que sumamos 1
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  return (
    <div>
      {/* Aquí se muestra el alert  en la parte superior si hubiera alguna */}
      <span className="alerts-position-top">{alert}</span>

      <h1>Feedback</h1>

      <div className="personalized-card">
        <div className="personalized-card2">
          <FeedbackForm
            handleSubmit={handleSubmit}
            createFeedback={createFeedback}
            inputFeedback={inputFeedback}
            errors={errors}
          />
        </div>
      </div>

      <div className="feedback-card-container">
        {feedbacktoDisplay.map((feedback) => {
          return (
            <div key={feedback._id} className="personalized-card mt-4">
              <div className="personalized-card2">
                <div className="personalized-form">
                  <span className="feedback-date">
                    <h2>{formatDate(feedback.creationDate)}</h2>
                  </span>
                  <p>{renderStars(feedback.rating)}</p>
                  <p>Comentario: {feedback.feedback}</p>

                  <div className="personalized-btn-container">
                    <button
                      className="personalized-button-edit"
                      onClick={() => clickEdit(feedback)}
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
        <Modal.Header className="custom-modal" closeButton>
          <Modal.Title>Editar feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal">
          <FeedbackEdit
            idFeedback={InfoFeedback?._id}
            fetchFeedback={fetchFeedback}
            setAlert={setAlert}
            setShowModal={setShowModal}
            infoFeedback={InfoFeedback}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Feedback;
