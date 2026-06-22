import React, { useState, useEffect } from 'react';

export default function TextSalaryComponent({ label, value }) {

  const [textData, settextData] = useState(value);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    settextData(value);
  }, [value]);

  return (
    <>
      <div className='text_salary_info'>
        <p className='salary_info_text'>{label}</p>
        <p className='salary_amt_info'>{textData}</p>
      </div>
    </>
  );
}
