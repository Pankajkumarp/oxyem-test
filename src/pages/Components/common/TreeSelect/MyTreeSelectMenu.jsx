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
        const response = await axiosJWT.get(`${apiUrl}/permission/getMenuTree`);
        const optionsData = response.data.data.map((item) => ({
          id: item.id,
          name: item.name,
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
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
      <div style={containerStyle}>
        <p style={headingStyle} className='box-heading'>Available</p>
        <div style={boxStyle} className='oxyem-motion-mover'>
          <input
            type="text"
            placeholder={`Search available ${documentType}...`}
            value={availableSearchTerm}
            onChange={(e) => setAvailableSearchTerm(e.target.value)}
            style={searchBoxStyle}
          />
          <div style={scrollContainerStyle}>
            <motion.ul>
              {filteredAvailableItems.map(item => (
                <motion.li
                  key={item.id}
                  style={listItemStyle(selectedItemIds.includes(item.id))}
                  onClick={() => toggleItemSelection(item.id)}
                >
                  {item.name}
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>
      </div>

      <div style={buttonStyle} className='button-svg'>
        <FaAngleRight size={20} style={buttonsvg} onClick={() => moveSelectedItems('available')} />
        <FaAngleLeft size={20} style={buttonsvg} onClick={() => moveSelectedItems('assigned')} />
        <FaAnglesRight size={20} style={buttonsvg} onClick={() => moveAll('available')} />
        <FaAnglesLeft size={20} style={buttonsvg} onClick={() => moveAll('assigned')} />
      </div>

      <div style={containerStyle}>
        <p style={headingStyle} className='box-heading'>Assigned</p>
        <div style={boxStyle} className='oxyem-motion-mover'>
          <input
            type="text"
            placeholder={`Search assigned ${documentType}...`}
            value={assignedSearchTerm}
            onChange={(e) => setAssignedSearchTerm(e.target.value)}
            style={searchBoxStyle}
          />
          <div style={scrollContainerStyle}>
            <motion.ul>
              {filteredAssignedItems.map(item => (
                <motion.li
                  key={item.id}
                  style={listItemStyle(selectedItemIds.includes(item.id))}
                  onClick={() => toggleItemSelection(item.id)}
                >
                  {item.name}
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const containerStyle = {
  width: '45%',
  position: 'relative',
};

const searchBoxStyle = { 
  padding: '10px 20px',
  width: '100%', 
  border: '1px solid var(--theme-border-searchbar-color)', 
  backgroundColor: '#e6e6e6',
  borderRadius: '5px',
};

const boxStyle = {
  border: '1px solid #ccc',
  borderRadius: '5px',
  padding: '0px',
  height: '300px',
};

const scrollContainerStyle = {
  height: '260px',
  overflowY: 'auto',
};

const headingStyle = {
  fontSize: 'var(--theme-small-text)',
  color: 'var(--theme-label-color)',
  fontWeight: '500',
  top: '-20px',
  left: '10px',
  background: 'var(--theme-white-color)',
  marginBottom: '0',
  padding: '0px 5px',
  zIndex: '9',
};

const listItemStyle = (isSelected) => ({
  padding: '10px 20px',
  backgroundColor: isSelected ? 'var(--theme-primary-color)' : 'white',
  color: isSelected ? 'white' : 'black',
  cursor: 'pointer',
});

const buttonStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '0 20px',
};

const buttonsvg = {
  margin: '10px',
  cursor: 'pointer',
};

export default RoleAssignment;
