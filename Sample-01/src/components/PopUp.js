import React from 'react';

const PopUp = ({ onClose, children }) => {
  return (
    <div className="back-modal" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PopUp;
