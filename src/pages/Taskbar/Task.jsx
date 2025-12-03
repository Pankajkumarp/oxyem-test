import { motion } from 'framer-motion';
import Profile from '../Components/commancomponents/profile';
import { useRef, useLayoutEffect, useState } from 'react';
import { FaCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { IoEyeSharp } from "react-icons/io5";
import { useRouter } from 'next/router';

const Task = ({ task, handleApprove, position ,openModal}) => {
  
  const router = useRouter();
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);
  useLayoutEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
    setHasMounted(true);
  }, []);

  const approvestaus = (status) => {
    switch (status) {
      case 'Approve':
        const status = 'approved'
        return <FaCheck onClick={() => handleApprove(task ,status)}/>;
      case 'Reject':
        const status1 = 'rejected'
        return <IoClose onClick={() => handleApprove(task ,status1)}/>;
      case 'View':
        return <IoEyeSharp onClick={() => openModal(task)} />;
      default:
        return null;
    }
  };

  const openProfile = (task) => {
    router.push(`/employeeDashboard/${task.idEmployee}`);
  };

  return (
    <motion.div
      className="oxyem-animation-section"
      ref={containerRef}
      initial={hasMounted ? { opacity: 0, x: position === 'pending' ? -50 : 50, scale: 1 } : {}}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      exit={{
        opacity: 0.5,
        x: containerWidth + 20, // Move to the right
        y: [0, -70, 10], // Consistent up, then down motion
        scale: 1.05
      }}
      transition={{ duration: 1.35, ease: 'easeInOut' }}
      whileTap={{
        y: 0, // Consistent upward movement on click
        scale: 1.05
      }}
      key={task.id}
    >
      <div className="row align-items-center">
        <div className="col-8">
          <div className="oxyem-cus-select-section">
            <div style={{ borderRadius: '50%', margin: '4px 10px' }}>
              <Profile name={task.name} imageurl="" size="30" 
              profilelink={`/employeeDashboard/${task.idEmployee}` || ""}
              
              />
            </div>
            <div className="oxyem-user-text">
              <h6><span onClick={() => openProfile(task)} className="main-text">{task.name}</span></h6>
              
              <p><span className="sub-text sub-text-massage">{task.message} {task.dateRange}</span></p>
            </div>
          </div>
        </div>
        <div className="col-4 sk-taskbar_ico">
          {position === 'pending' &&
            task.actions.map((action) => (
              <>
              <span
                className={`oxyem-ds-${action}`}
                // onClick={() => handleApprove(task)}
                key={action}
              >
                {approvestaus(action)}
              </span>
            </>
            ))
          }
          

          {task.status && 
            <>
            <span className={`oxyem-mark-${task.status}`} style={{ margin: '20px 0px 0px -30px' }}>
              {task.status}
            </span>
          </>
          
          }
        </div>
      </div>
    </motion.div>
  );
};

export default Task;