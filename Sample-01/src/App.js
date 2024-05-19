import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container } from "reactstrap";
// import Loading from "./components/Loading";
import NavBar from "./components/NavBar";
import Home from "./views/Home";
import Profile from "./views/Profile";
// import { useAuth0 } from "@auth0/auth0-react";
import history from "./utils/history";

// styles
import "./App.css";

// fontawesome
import initFontAwesome from "./utils/initFontAwesome";
import FlightList from "./views/FlightList";
import Flight from "./views/FlightDetails";
import PurchaseList from "./views/MyPurchases";
//import ConfirmPurchase from "./views/ConfirmPurchase";
//import PurchaseCompleted from "./views/PurchaseCompleted";

initFontAwesome();

const App = () => {
  // const { isLoading, error } = useAuth0();

  // if (error) {
  //   return <div>Oops... {error.message}</div>;
  // }

  // if (isLoading) {
  //   return <Loading />;
  // }

  return (
    <Router>
      <div id="app" className="d-flex flex-column h-100">
        <NavBar />
        <Container className="flex-grow-1 mt-5">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/flights" element={<FlightList/>}/>
            <Route path="/details/:flightId" element={<Flight/>}/>
            <Route path="/mypurchases" element={<PurchaseList/>} />
          </Routes>
        </Container>
        {/*<Footer />*/}
      </div>
    </Router>
  );
};

export default App;
