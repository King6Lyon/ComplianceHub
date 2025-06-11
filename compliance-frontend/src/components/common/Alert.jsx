import React from 'react';
import './styles/Alert.css';

const Alert = ({ type = 'info', message, onClose }) => {
  return (
    <div className={`alert alert-${type}`}>
      <span>{message}</span>
      {onClose && (
        <button className="alert-close" onClick={onClose}>
          &times;
        </button>
      )}
    </div>
  );
};

export default Alert;