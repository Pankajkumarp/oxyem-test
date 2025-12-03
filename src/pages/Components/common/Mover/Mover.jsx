import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaAnglesLeft, FaAnglesRight, FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import { axiosJWT } from '../../../Auth/AddAuthorization';

const RoleAssignment = ({ documentType, onChange, value, availableOption }) => {
  const [availableItems, setAvailableItems] = useState(availableOption || []);
  const [assignedItems, setAssignedItems] = useState([]);
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [availableSearchTerm, setAvailableSearchTerm] = useState('');
  const [assignedSearchTerm, setAssignedSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (Array.isArray(value)) {
      setAssignedItems(value);
    } else {
      setAssignedItems([]);
    }
  }, [value]);

  useEffect(() => {
    if (Array.isArray(availableOption)) {
      setAvailableItems(availableOption);
    } else {
      setAvailableItems([]);
      fetchOptions();
    }
  }, [availableOption]);

  const fetchOptions = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.get(`${apiUrl}/dropdowns`, {
        params: { isFor: documentType }
      });
      const optionsData = response.data.data.map((item) => ({
        id: item.id,
        name: item.name,
        isFor: item.isFor // Ensure to include the isFor property
      }));
      setAvailableItems(optionsData);
    } catch (error) {
      console.error('Error fetching options:', error);
      setError(error.message || 'Failed to fetch options');
    }
  };

  useEffect(() => {
    fetchOptions();
  }, [documentType]);

  const filteredAvailableItems = availableItems.filter(item =>
    item.name.toLowerCase().includes(availableSearchTerm.toLowerCase())
  );

  const filteredAssignedItems = assignedItems.filter(item =>
    item.name.toLowerCase().includes(assignedSearchTerm.toLowerCase())
  );

  const toggleItemSelection = (itemId) => {
    setSelectedItemIds(prevSelectedItemIds =>
      prevSelectedItemIds.includes(itemId)
        ? prevSelectedItemIds.filter(id => id !== itemId)
        : [...prevSelectedItemIds, itemId]
    );
  };

  const moveSelectedItems = (from) => {
    let itemsToMove;
    if (from === 'available') {
      itemsToMove = availableItems.filter(item => selectedItemIds.includes(item.id));
      setAvailableItems(availableItems.filter(item => !selectedItemIds.includes(item.id)));
      setAssignedItems([...assignedItems, ...itemsToMove]);
      onChange([...assignedItems, ...itemsToMove]);
    } else {
      itemsToMove = assignedItems.filter(item => selectedItemIds.includes(item.id));
      setAssignedItems(assignedItems.filter(item => !selectedItemIds.includes(item.id)));
      setAvailableItems([...availableItems, ...itemsToMove]);
      onChange(assignedItems.filter(item => !selectedItemIds.includes(item.id)));
    }
    setSelectedItemIds([]); // Reset selection after moving
  };

  const moveAll = (from) => {
    if (from === 'available') {
      const allAvailableItems = [...availableItems];
      setAssignedItems([...assignedItems, ...allAvailableItems]);
      setAvailableItems([]);
      onChange([...assignedItems, ...allAvailableItems]);
    } else {
      const allAssignedItems = [...assignedItems];
      setAvailableItems([...availableItems, ...allAssignedItems]);
      setAssignedItems([]);
      onChange([]);
    }
  };

  return (
    <div id='mover-oxyem-select'>
      <div  className='mover-main-container'>
        <p className='box-heading'>Available</p>
        <div className='oxyem-motion-mover'>
          <input
            type="text"
            placeholder={`Search available ${documentType}...`}
            value={availableSearchTerm}
            onChange={(e) => setAvailableSearchTerm(e.target.value)}
            className='searchBoxStyle'
          />
          <div className='scrollContainerStyle'>
            <motion.ul>
              {filteredAvailableItems.map(item => (
                <motion.li
                  key={item.id}
                  style={listItemStyle(selectedItemIds.includes(item.id))}
                  onClick={() => toggleItemSelection(item.id)}
                >
                  {item.name} {item.isFor && <span className='groupisforMoverspan spanIsFor' >{item.isFor}</span>}
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>
      </div>

      <div className='button-svg buttonStyle'>
        <FaAngleRight size={20} style={buttonsvg} onClick={() => moveSelectedItems('available')} />
        <FaAngleLeft size={20} style={buttonsvg} onClick={() => moveSelectedItems('assigned')} />
        <FaAnglesRight size={20} style={buttonsvg} onClick={() => moveAll('available')} />
        <FaAnglesLeft size={20} style={buttonsvg} onClick={() => moveAll('assigned')} />
      </div>

      <div className='mover-main-container'>
        <p className='box-heading'>Assigned</p>
        <div className='oxyem-motion-mover'>
          <input
            type="text"
            placeholder={`Search assigned ${documentType}...`}
            value={assignedSearchTerm}
            onChange={(e) => setAssignedSearchTerm(e.target.value)}
            className='searchBoxStyle'
          />
          <div className='scrollContainerStyle'>
            <motion.ul>
              {filteredAssignedItems.map(item => (
                <motion.li
                  key={item.id}
                  style={listItemStyle(selectedItemIds.includes(item.id))}
                  onClick={() => toggleItemSelection(item.id)}
                >
                 {item.name} {item.isFor && <span className='groupisforMoverspan spanIsFor'>({item.isFor})</span>}

                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const listItemStyle = (isSelected) => ({
  padding: '10px 20px',
  backgroundColor: isSelected ? 'var(--theme-primary-color)' : 'white',
  color: isSelected ? 'white' : 'black',
  cursor: 'pointer',
});

const buttonsvg = {
  margin: '10px',
  cursor: 'pointer',
};

export default RoleAssignment;
