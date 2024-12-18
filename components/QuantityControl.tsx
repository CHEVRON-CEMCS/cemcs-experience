import React from 'react'

const QuantityControl = ({ 
    quantity, 
    onIncrease, 
    onDecrease 
   }: { 
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
   }) => (
    <div className="flex items-center border rounded-md">
      <button 
        onClick={onDecrease}
        className="px-3 py-1 border-r hover:bg-gray-100"
      >
        -
      </button>
      <span className="px-4">{quantity}</span>
      <button 
        onClick={onIncrease}
        className="px-3 py-1 border-l hover:bg-gray-100"
      >
        +
      </button>
    </div>
   );

export default QuantityControl