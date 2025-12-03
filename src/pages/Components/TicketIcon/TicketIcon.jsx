import React, { useState } from 'react';
import Ticket from './TicketPopup.jsx';
import html2canvas from 'html2canvas';
import { RxChatBubble } from "react-icons/rx";
import { Tooltip } from 'react-tooltip';
export default function TicketIcon({ userFormdata }) {
  const [isOpen, setIsOpen] = useState(false);
  const [screenshot, setScreenshot] = useState(null);
 
  const handleOpen = async () => {
    const canvas = await html2canvas(document.body , {
    width: window.innerWidth,
    height: window.innerHeight,
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    scrollX: window.scrollX,
    scrollY: window.scrollY
  }); // Or specific element
    const imgData = canvas.toDataURL('image/png');
    setScreenshot(imgData);
    setIsOpen(true);
  };
 
  const closeModal = () => {
    setIsOpen(false);
    setScreenshot(null); // Reset
  };
 
  return (
    <>
      <Ticket isOpen={isOpen} closeModal={closeModal} screenshot={screenshot} />
      <div className="fab-button">
        <button
          onClick={handleOpen}
          className="btn btn-primary ticket-btn"
          data-tooltip-id="info-tooltip"
          data-tooltip-content={`Raise a ticket with Support team`}
        >
          <RxChatBubble size={30}/>
        </button>
      </div>
      <Tooltip id="info-tooltip" place="top" effect="solid" multiline style={{zIndex:'9999'}}/>
    </>
  );
}