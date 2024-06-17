import React from "react";

function Home() {
  return (
    <div>
      {" "}
      <div>
        <div className="personalized-form-card">
          <div className="personalized-form-card2">
            <form className="personalized-form-form">
              <p id="heading" className="personalized-form-heading">
                Home
              </p>

              <div className="personalized-form-field">
                <input
                  type="text"
                  className="personalized-form-input-field"
                  placeholder="Comentario"
                />
              </div>
              <div className="personalized-form-btn">
                <button className="personalized-form-button1 m-2">crear</button>
                <button className="personalized-form-button2 m-2">
                  editar
                </button>
              </div>
              <button className="personalized-form-button3">Borrar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
