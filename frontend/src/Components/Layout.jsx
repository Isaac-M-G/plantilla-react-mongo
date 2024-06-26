import { Outlet } from "react-router-dom";
import Navbar from "./Navbar/Navbar";

const Layout = () => {
  return (
    <div className="App">
      <Navbar />
      <div className="Outlet">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
