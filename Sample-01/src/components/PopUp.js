import React from 'react';

const Popup = ({ onClose, children }) => {
  return (
    <div className='back-modal'>
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        {children}
      </div>
    </div>
    </div>
  );
};

export default Popup;
