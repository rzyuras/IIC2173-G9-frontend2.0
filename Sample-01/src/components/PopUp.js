import React from 'react';

const Popup = ({ onClose, children, style='' }) => {
  return (
    <div className='back-modal'>
    <div className={`modal ${style}`} onClick={(e) => e.stopPropagation()}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        {children}
      </div>
    </div>
    </div>
  );
};

export default Popup;