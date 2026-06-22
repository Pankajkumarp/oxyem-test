import  { useState } from "react";
import { MdClose } from "react-icons/md";
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import { TbSubtask } from "react-icons/tb";

const TaskTemplates = ({ isOpen, closeModal, templateArray, getSelectTemplate}) => {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [error, setError] = useState("");
const handleSelect = (value) => {
    setSelectedTemplate(value);
    setError("");
  };

  const handleSubmit = () => {
    if (!selectedTemplate) {
      setError("Please select a template to continue.");
      return;
    }
    setError("");
    getSelectTemplate(selectedTemplate)
  };
  return (
    <Drawer
      open={isOpen}
      onClose={closeModal}
      direction='right'
      className='custom-drawer'
      overlayClassName='custom-overlay'
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header mb-2">
            <h4 className="modal-title" id="myLargeModalLabel"></h4>
            <button className="oxyem-btn-close" onClick={closeModal}>
              <MdClose />
            </button>
          </div>
          <div className="modal-body  oxyem-assign-member-popup">
            <div className="template-tittle-div">
              <TbSubtask/>
              <h6> Please select the template to auto create the underneath sub-tasks</h6>
            </div>
            <div className="oxyem-template-view">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Template Name</th>
                    <th>Description</th>
                    <th className="input-table-field">Radio Button</th>
                  </tr>
                </thead>
                <tbody>
                  {templateArray.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.templateName}</td>
                      <td>{item.description || "-"}</td>
                      <td className="text-center">
                        <input
                          type="radio"
                          name="taskTemplate"
                          value={item.value}
                          checked={selectedTemplate === item.value}
                          onChange={() => handleSelect(item.value)}
                          className="form-check-input"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {error && (
                <div className="error mb-0">
                  {error}
                </div>
              )}
              <div className="text-end mt-3">
                <button
                  className="btn btn-primary"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default TaskTemplates;
