import React, { useState, useEffect } from 'react';
import { axiosJWT } from '../../../Auth/AddAuthorization';
import StarRatingComponent from '../Inputfiled/StarRatingComponent';

export default function RatingComponent({ documentType, onChange, value,isDisabled}) {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [ratings, setRatings] = useState({}); // Store ratings per question ID

  const fetchOptions = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.get(`${apiUrl}/jobs/onboardQuestions`);
      setQuestions(response.data.data || []);
    } catch (error) {
      setError(error.message || 'Failed to fetch options');
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  useEffect(() => {
    if (value && Object.keys(value).length > 0) {
      const matchedRatings = {};
      questions.forEach(question => {
        if (value[question.idQuestion] !== undefined) {
          matchedRatings[question.idQuestion] = value[question.idQuestion];
        }
      });
      setRatings(prevRatings => ({ ...prevRatings, ...matchedRatings }));
    }
  }, [value, questions]);

  const handleRatingChange = (questionId, newRating) => {
    const updatedRatings = {
      ...ratings,
      [questionId]: newRating,
    };
    setRatings(updatedRatings);

    if (onChange) {
      onChange(updatedRatings);
    }
  };

  const filteredQuestions = questions.filter(q => q.sectionFor === documentType);

  return (
    <div>
      {filteredQuestions.length === 0 ? (
        <></>
      ) : (
        filteredQuestions.map(question => (
          <p key={question.idQuestion} className="onboard-question">
            <StarRatingComponent
              value={ratings[question.idQuestion] || 0}
              onChange={newRating => handleRatingChange(question.idQuestion, newRating)}
              label={question.value}
              validations={[{ type: 'required' }]} // Example validation
              readonly={isDisabled}
            />
          </p>
        ))
      )}
    </div>
  );
}