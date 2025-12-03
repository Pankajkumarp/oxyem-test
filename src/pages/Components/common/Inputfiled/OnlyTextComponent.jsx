import React, { useState, useEffect } from 'react';

export default function OnlyTextComponent({label}) {

  return (
    <span className='text_with_input'>
      {label}
    </span>
  );
}
