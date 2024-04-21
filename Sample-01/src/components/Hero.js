import React from "react";
import { UserIcon } from "@heroicons/react/24/outline";
import flight from "../assets/flight.svg"

const Hero = () => (
  <div className="text-center hero my-5">
    <img src={flight} alt="app logo" width="180" />
    <h1 className="mb-4">FlightsApp</h1>

    <div>
    <p className="lead">
      Volar nunca fue tán fácil.
    </p>
    </div>
  </div>
);

export default Hero;
