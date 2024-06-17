import React from "react";
import "./Feedback.css";
import {
  selectToBD,
  createToBD,
  deleteByIDToBD,
  urlFeedbackBackend,
  ErrorAlert,
  SuccessAlert,
} from "../../GlobalVariables";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

function Feedback() {
  // -------------------------------------------------------------------
  // -- Para mostrar
  // -------------------------------------------------------------------
  const [feedbacktoDisplay, setFeedbacktoDisplay] = useState([]);
  const [alert, setAlert] = useState(false);

  // -------------------------------------------------------------------
  // -- Para inputs
  // -------------------------------------------------------------------

  const [feedbackInput, setFeedbackInput] = useState("");
  const [ratingInput, setRatingInput] = useState("");

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

  const createFeedback = async (event) => {
    event.preventDefault();
    if (feedbackInput === "" || ratingInput === "") {
      setAlert(
        <ErrorAlert
          key={uuidv4()}
          message="Por favor, complete todos los campos"
        />
      );
      return;
    }
    setAlert(false);
    const newData = {
      feedback: feedbackInput,
      rating: ratingInput,
    };
    const response = await createToBD(urlFeedbackBackend, newData);
    setAlert(response);
    await fetchFeedback();
  };

  const renderStars = (rating) => {
    const maxRating = 5;
    const filledStars = rating > 0 ? Math.floor(rating) : 0;
    const halfStar = rating % 1 === 0.5 ? 1 : 0;

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
            <form className="personalized-form" onSubmit={createFeedback}>
              <p id="heading" className="personalized-heading">
                Comentar
              </p>

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
                          onChange={(e) => setRatingInput(e.target.value)}
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

              <div className="personalized-field">
                <input
                  required
                  type="text"
                  className="personalized-input-field"
                  placeholder="Comentario"
                  onChange={(e) => setFeedbackInput(e.target.value)}
                />
              </div>
              <button type="submit" className="personalized-button1">
                crear
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
                  <h2>{formatDate(feedback.creationDate)}</h2>
                  <p>{renderStars(feedback.rating)}</p>
                  <p>Comentario: {feedback.feedback}</p>
                  <button
                    className="personalized-button3"
                    onClick={() => deleteFeedback(feedback._id)}
                  >
                    Borrar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Feedback;
