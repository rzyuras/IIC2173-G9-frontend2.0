import React from "react";
import { QuantityPicker } from "react-qty-picker";

class Picker extends React.Component {
  render() {
    const { min, max } = this.props;
    const darta = [{ max: max }];

    return (
      <div>
        {darta.map((data, index) => (
          <div key={index} className="picker">
            <QuantityPicker smooth min={min} max={data.max} />
          </div>
        ))}
      </div>
    );
  }
}

export default Picker;
