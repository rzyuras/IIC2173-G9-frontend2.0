import React from "react";
import { QuantityPicker } from "react-qty-picker";

export default class Picker extends React.Component {
    render() {
      const darta = [
        {
          max: 1
        }
      ];
      return (
        <div>
          {darta.map((data) => (
            <div className="picker">
              <QuantityPicker smooth min={0} max={5} />
            </div>
          ))}
        </div>
      );
    }
  }