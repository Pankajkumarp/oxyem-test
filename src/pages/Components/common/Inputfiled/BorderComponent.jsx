import React, { useState, useEffect } from 'react';

export default function BorderComponent({ type, readonly, isDisabled, placeholder, label, value, validations = [], onChange }) {

  return (
    <div className='border_field'>
      <span className='border_field_text'></span>
    </div>
  );
}
