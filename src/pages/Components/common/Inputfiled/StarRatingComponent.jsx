import React, { useState, useEffect } from 'react';
import LabelMandatory from '../Label/LabelMandatory';
import LabelNormal from '../Label/LabelNormal';
import Rating from 'react-rating';
import { FaRegStar, FaStar } from 'react-icons/fa';
export default function StarRatingComponent({ type, readonly, isDisabled, placeholder, label, value, validations = [], onChange }) {
  const isRequired = validations.some(validation => validation.type === "required");

  const [rating, setRating] = useState(value);
  useEffect(() => {
    // Synchronize internal state with props
    setRating(value);

  }, [value]);

  const handleRateChange = (rate) => {
    setRating(rate);
    onChange(rate); // Notify parent component about value change
  };
  return (
    <div className='rating_star_input'>
      {isRequired ? <LabelMandatory labelText={label} /> : <LabelNormal labelText={label} />}
      <div className='rating_starnput'>
      <Rating
        initialRating={rating}
        onChange={handleRateChange}
        emptySymbol={<FaRegStar className='sk-rating-empty' />}
        fullSymbol={<FaStar />}
        fractions={2}
        stop={10}
        readonly={readonly} 
      />
      </div>

    </div>
  );
}
