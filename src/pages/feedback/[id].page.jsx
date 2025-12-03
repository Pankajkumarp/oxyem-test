import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { axiosJWT } from '../Auth/AddAuthorization';
import DynamicForm from './DynmicForm';

export default function page() {
  const router = useRouter();
  const [formDetails, setFormDetails] = useState(null);
  const [onlyView ,setOnlyView] = useState("")
  const { id } = router.query;

  useEffect(() => {
  if (id) {
    async function fetch() {
      const { data } = await axiosJWT.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/feedback/myFeedbackForm`,
        { params: { idShare: id } }
      );

      if (data?.data?.[0]) {
        const formInfo = data.data[0];
        setFormDetails(formInfo.formData);
        setOnlyView(formInfo.onlyView); // ✅ set it from the correct place
        if(formInfo.status === 'inactive'){
        setOnlyView(true);
        }
      }
    }
    fetch();
  }
}, [id]);


  console.log(onlyView)
  return (
    <div>
      <DynamicForm formData={formDetails} shareId={id} onlyView={onlyView}/>
    </div>
  )
}
