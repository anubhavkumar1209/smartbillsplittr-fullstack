import React, { createContext, useContext, useState } from 'react';

const GroupContext = createContext();

export const useGroups = () => {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error('useGroups must be used within a GroupProvider');
  }
  return context;
};

export const GroupProvider = ({ children }) => {
  const [groups, setGroups] = useState([]);

  const addGroup = (groupData) => {
    const newGroup = {
      ...groupData,
      id: Date.now(),
      totalExpenses: 0,
      expenses: [],
      settlements: [],
      createdAt: new Date().toISOString().split('T')[0]
    };
    setGroups(prevGroups => [...prevGroups, newGroup]);
    console.log('✅ Group added to context:', newGroup);
    return newGroup;
  };

  const updateGroup = (groupId, updates) => {
    setGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === parseInt(groupId) ? { ...group, ...updates } : group
      )
    );
    console.log('✅ Group updated in context:', groupId, updates);
  };

  const deleteGroup = (groupId) => {
    setGroups(prevGroups => 
      prevGroups.filter(group => group.id !== parseInt(groupId))
    );
    console.log('✅ Group deleted from context:', groupId);
  };

  const getGroupById = (groupId) => {
    const group = groups.find(group => group.id === parseInt(groupId));
    console.log('🔍 Getting group by ID:', groupId, group);
    return group;
  };

  console.log('📊 Current groups in context:', groups);

  return (
    <GroupContext.Provider value={{
      groups,
      addGroup,
      updateGroup,
      deleteGroup,
      getGroupById
    }}>
      {children}
    </GroupContext.Provider>
  );
};
