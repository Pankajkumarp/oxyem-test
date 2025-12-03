'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { axiosJWT } from '../Auth/AddAuthorization';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function Page() {
  const router = useRouter();
  const [groupedResponses, setGroupedResponses] = useState({});
  const { id } = router.query;

  // useEffect(() => {
  //   if (id) {
  //     async function fetchData() {
  //       const { data } = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/feedback/feedbackResponse`, {
  //         params: { idShare: id },
  //       });

  //       if (data?.data?.length > 0) {
  //         const grouped = {};

  //         data.data.forEach((response) => {
  //           response.fields.forEach((field) => {
  //             const fieldId = field.id;

  //             if (!grouped[fieldId]) {
  //               grouped[fieldId] = {
  //                 label: field.label,
  //                 type: field.type,
  //                 responses: [],
  //               };
  //             }

  //             grouped[fieldId].responses.push({
  //               value: field.value,
  //               userId: response.idUserResponse,
  //               date: response.CreatedDate,
  //             });
  //           });
  //         });

  //         setGroupedResponses(grouped);
  //       }else{
  //          const { data } = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/feedback/myFeedbackForm`, {
  //             params: { idShare: id },
  //           });
  //       }
  //     }

  //     fetchData();
  //   }
  // }, [id]);

  useEffect(() => {
  if (id) {
    async function fetchData() {
      try {
        // First API call
        const { data } = await axiosJWT.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/feedback/feedbackResponse`,
          { params: { idShare: id } }
        );

        if (data?.data?.length > 0) {
          const grouped = {};

          data.data.forEach((response) => {
            response.fields.forEach((field) => {
              const fieldId = field.id;

              if (!grouped[fieldId]) {
                grouped[fieldId] = {
                  label: field.label,
                  type: field.type,
                  responses: [],
                };
              }

              grouped[fieldId].responses.push({
                value: field.value,
                userId: response.idUserResponse,
                date: response.CreatedDate,
                employeeName: response.employeeName,
              });
            });
          });

          setGroupedResponses(grouped);
        } else {
          await fetchMyFeedbackForm();
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          await fetchMyFeedbackForm();
        } else {
          console.error("Error fetching feedbackResponse:", error);
        }
      }
    }

    async function fetchMyFeedbackForm() {
      try {
        const { data } = await axiosJWT.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/feedback/myFeedbackForm`,
          { params: { idShare: id } }
        );

        if (data?.data?.length > 0) {
          const form = data.data[0];
          const grouped = {};

          form.formData.fields.forEach((field) => {
            grouped[field.id] = {
              label: field.label,
              type: field.type,
              responses: [
                {
                  value: field.value, // might be null initially
                  userId: null,
                  date: null,
                },
              ],
            };
          });

          setGroupedResponses(grouped);

          // If you want to store additional info like title
          setFormTitle(form.formData.title);
          setIdFeedbackForm(form.idFeedbackForm);
        }
      } catch (error) {
        console.error("Error fetching myFeedbackForm:", error);
      }
    }

    fetchData();
  }
}, [id]);


  // Helper to count values for chart
  const getValueCounts = (responses) => {
    const counts = {};
    responses.forEach((r) => {
      if (!r.value) return;
      counts[r.value] = (counts[r.value] || 0) + 1;
    });
    return counts;
  };

  return (
    <div className="main-wrapper">
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="container mt-4">
            <h2 className="mb-4">Feedback Responses</h2>

            {Object.keys(groupedResponses).map((fieldId) => {
              const field = groupedResponses[fieldId];
              const valueCounts = getValueCounts(field.responses);
              const options = Object.keys(valueCounts);
              const series = options.map((opt) => valueCounts[opt]);

              return (
                <div key={fieldId} className="mb-5 p-3 border rounded shadow-sm">
                  <h5 className="mb-3">{field.label}</h5>

                 {field.type === 'select' || field.type === 'rating' ? (
  <div className="row">
    {/* Left: Value list (50%) */}
    <div className="col-md-6">
      <ul className="list-group mb-3">
        {options.map((opt, idx) => (
          <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
            {opt}
            <span className="badge bg-primary rounded-pill">{valueCounts[opt]}</span>
          </li>
        ))}
      </ul>
    </div>

    {/* Right: Chart (50%) */}
    <div className="col-md-6 d-flex justify-content-center align-items-center">
      {series.length > 0 && (
        <Chart
          options={{
            labels: options,
            legend: {
              position: 'bottom',
            },
          }}
          series={series}
          type="donut"
          width="100%"
        />
      )}
    </div>
  </div>
) : (
  <ul className="list-group">
    {field.responses.map((res, index) =>
  res.value !== null && (
    <li key={index} className="list-group-item">
      <strong>Response:</strong> {res.value}
      <br />
      <small className="text-muted">
        Submitted by {res.employeeName} on: {new Date(res.date).toLocaleString()}
      </small>
    </li>
  )
)}

  </ul>
)}

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
