import React from 'react';
import Employee from '../Components/common/SelectComponent/SelectOptionComponent';

export default function ShareSection({handelRoleChange}) {
   
  return (
    <div className=" rounded shadow-md w-full max-w-md mx-auto">
      <div className="mb-4 row">
        <div className="col-md-12">
          <Employee label={'Role'} documentType={'roles'} onChange={handelRoleChange}/>
        </div>
      </div>
    </div>
  );
}
