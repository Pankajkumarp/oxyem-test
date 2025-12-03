import React, { useState, useEffect } from "react";
import ReactModal from 'react-modal';
import { MdClose } from "react-icons/md";
import Textarea from '../common/Inputfiled/TextAreaComponentcomman';
import { axiosJWT } from '../../Auth/AddAuthorization.jsx';
const customStyles = {
  content: {
    background: '#fff',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

export default function SendEmailModal({ isOpen, closeModal, id ,pagename,email ,handleSendEmail}) {
  const [emails, setEmails] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const onChange = (newValue) => {
    setEmails(newValue);
    setValidationMessage('');
  };
  const getEmailDetails = async (id) => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/opportunity/getClientEmail`, {
        params: {
          id: id,
        },
      });
      if (response && response.data && response.data.data) {
        const emailString = response.data.data.join(', '); 
        setEmails(emailString)
      }
    } catch (error) {
      console.error("Error occurred while fetching attendance details:", error);
    }
  };

  // useEffect(() => {
  //   if (isOpen) {
  //     getEmailDetails(id);
  //   }
  // }, [isOpen, id]);
  useEffect(() => {
    if (pagename === 'onboardingProcess' && email !== '') {
      setEmails(email);
    }
    else if(isOpen || pagename !== 'onboardingProcess' ){
      getEmailDetails(id);
    }
  }, [isOpen, id ,pagename]);

  const handleSubmit = async () => {
    const emailList = emails.split(',').map(email => email.trim());

    // Validate each email address
    const invalidEmails = emailList.filter(email => !emailRegex.test(email));

    if (invalidEmails.length > 0) {
      setValidationMessage(`Invalid email address(es): ${invalidEmails.join(', ')}`);
      return;
    }

    if (emails.trim() === '') {
      setValidationMessage('Email addresses are required.');
      return;
    }

    setValidationMessage('');
    const payload = {
      idInvoice: id,
      email: emailList
    };

    const response = await axiosJWT.post(`${apiUrl}/opportunity/invoiceDispatch`, payload);
    if (response) {
      setEmails('')
      closeModal()
    }
  };

const handleSubmitOfferLatter = async () => {
    const emailList = emails.split(',').map(email => email.trim());
  
    // Validate each email address
    const invalidEmails = emailList.filter(email => !emailRegex.test(email));
  
    if (invalidEmails.length > 0) {
      setValidationMessage(`Invalid email address(es): ${invalidEmails.join(', ')}`);
      return;
    }
  
    if (emails.trim() === '') {
      setValidationMessage('Email addresses are required.');
      return;
    }
  
    setValidationMessage('');
    const emailString = emailList.join(', ');  // Convert array to comma-separated string
    const payload = {
      idJobApplicant: id,
      email: emailString  // Use string instead of array
    };
  
    handleSendEmail(payload);
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Modal"
      style={customStyles}
    >
      <div className="modal-dialog modal-lg oxyem-user-image-select send_mail_input_popup">
        <div className="modal-content">
          <div className="modal-header mb-4">
            <h4 className="modal-title" id="myLargeModalLabel">Enter Email Addresses</h4>
            <button className="oxyem-btn-close" onClick={closeModal}><MdClose /></button>
          </div>
          <div className="modal-body">
            <div className="form-group">
            {pagename === 'onboardingProcess' ? 
              <Textarea
                label={"Email"}
                placeholder={""}
                name={"emails"}
                onChange={onChange}
                value={emails}
                isDisabled={true}
              />
              :
              <Textarea
                label={"Emails"}
                placeholder={"Enter multiple email addresses (comma separated)"}
                name={"emails"}
                onChange={onChange}
                value={emails}
              />
            }
              

            </div>
            {validationMessage && <div className="error text-danger">{validationMessage}</div>}
            <div className="text-end w-100">
              {pagename === "onboardingProcess" ?
                <button className="btn btn-primary" onClick={handleSubmitOfferLatter} >Send</button>
                :
                <button className="btn btn-primary" onClick={handleSubmit} >Submit</button>
              }
            </div>
          </div>
        </div>
      </div>
    </ReactModal>
  );
}
