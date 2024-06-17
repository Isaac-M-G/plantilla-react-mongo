import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Components/Layout";
import Feedback from "./Views/Feedback/Feedback";
import Home from "./Views/Home/Home";
import { NotFound } from "./GlobalVariables";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/Feedback" element={<Feedback />} />

            <Route
              path="*"
              element={<NotFound mensaje="La página que busca no existe" />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;