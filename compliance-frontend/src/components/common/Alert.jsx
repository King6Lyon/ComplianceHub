import React from 'react';

const Alert = ({ type = 'info', message, onClose }) => {
  const baseClasses = 'w-full flex items-center justify-between px-4 py-3 rounded-md shadow-sm text-sm mb-4';
  const typeClasses = {
    info: 'bg-blue-100 text-blue-800 border border-blue-300',
    success: 'bg-green-100 text-green-800 border border-green-300',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    error: 'bg-red-100 text-red-800 border border-red-300'
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type] || typeClasses.info}`}>
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-lg font-bold focus:outline-none hover:text-black"
          aria-label="Close"
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default Alert;
