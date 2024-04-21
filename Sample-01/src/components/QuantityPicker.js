import React, { useState } from "react";
import { QuantityPicker } from "react-qty-picker";

function Picker({ min, max, onChange }) {
  const [selectedValue, setSelectedValue] = useState(0);

  const handleQuantityChange = (value) => {
    setSelectedValue(value);
    onChange(value);
  };

  const darta = [{ max }];

  return (
    <div>
      {darta.map((data, index) => (
        <div key={index} className="picker">
          <QuantityPicker
            smooth
            min={min}
            max={data.max}
            value={selectedValue}
            onChange={handleQuantityChange}
          />
        </div>
      ))}
    </div>
  );
}

export default Picker;
