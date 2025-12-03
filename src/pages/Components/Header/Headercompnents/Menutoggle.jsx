import { useState } from 'react';  // Import useState
import { CgMenuLeft, CgMenuRight } from "react-icons/cg";
import { RxCross2 } from "react-icons/rx";
export default function MenuToggle() {
  const [showCross, setShowCross] = useState(false);

  const handleClick = () => {
    setShowCross((prev) => !prev); // Toggle the state
    document.querySelector('body').classList.toggle('mini-sidebar');
  };

  return (
    <div className="menu-toggle">
      <span onClick={handleClick} id="toggle_btn">
        {showCross ? <RxCross2  size={20}/> : <CgMenuLeft size={20}/>}
      </span>
    </div>
  );
}
