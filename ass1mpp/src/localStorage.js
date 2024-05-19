import axios from "axios";

// Local storage utility functions
const itemExistsInLocalStorage = (key, itemId) => {
  const storedItems = JSON.parse(localStorage.getItem(key)) || [];
  return storedItems.some(item => item.id === itemId);
};

// Add item to local storage only if it doesn't exist
export const addItemToLocalStorageWithoutDuplicates = (key, item) => {
  if (!itemExistsInLocalStorage(key, item.id)) {
    const storedItems = JSON.parse(localStorage.getItem(key)) || [];
    storedItems.push(item);
    localStorage.setItem(key, JSON.stringify(storedItems));
  }
};
export const deleteItemFromLocalStorage = (key, itemId) => {
  let storedItems = JSON.parse(localStorage.getItem(key)) || [];
  storedItems = storedItems.filter((item) => item.id !== itemId);
  localStorage.setItem(key, JSON.stringify(storedItems));
};


 export const removeDuplicatesFromLocalStorage = (key) => {
  let items = JSON.parse(localStorage.getItem(key)) || [];
  const uniqueItems = [];
  const ids = new Set();

  for (const item of items) {
    if (!ids.has(item.id)) {
      uniqueItems.push(item);
      ids.add(item.id);
    }
  }

  localStorage.setItem(key, JSON.stringify(uniqueItems));
};

  
  export const getAllItemsFromLocalStorage = (key) => {
    const items = JSON.parse(localStorage.getItem(key));
    return items ? items : [];
  };
  
  export const clearLocalStorage = (key) => {
    localStorage.removeItem(key);
  };

  // Function to update an item in local storage
export const updateItemInLocalStorage = (key, updatedItem) => {
  const storedItems = JSON.parse(localStorage.getItem(key)) || [];
  const updatedItems = storedItems.map((item) => {
    return item.id === updatedItem.id ? updatedItem : item;
  });
  localStorage.setItem(key, JSON.stringify(updatedItems));
};


export const getItemFromLocalStorageById = (key, itemId) => {
  const storedItems = JSON.parse(localStorage.getItem(key)) || [];
  return storedItems.find((item) => item.id === itemId);
};


  
  export const syncWithServerLocal = async (key, serverUrl) => {
    const localItems = JSON.parse(localStorage.getItem(key)) || [];
  
    for (const item of localItems) {
      try {
        // Check if the item already exists on the server
        const response = await axios.get(`http://localhost:8081/read/${item.id}`);
  
        // If it exists, skip the insertion
        if (response.data) {
          //console.log(`Item with id ${item.id} already exists. Skipping.`);
          await axios.patch(`http://localhost:8081/update/${item.id}`, item);
        console.log(`Updated item with id ${item.id}`);
        continue;
        }
      } catch (error) {
        // If the item doesn't exist, proceed with insertion
        if (error.response && error.response.status === 404) {
          try {
            await axios.post(serverUrl, item);
            console.log(`Inserted item with id ${item.id}`);
          } catch (postError) {
            console.log(`Failed to insert item with id ${item.id}`, postError);
          }
        } else {
          console.log(`Failed to check item with id ${item.id}`, error);
        }
      }
      deleteItemFromLocalStorage(key,item.id);
    }
    clearLocalStorage(key);
  };
  export const syncWithServerLocalFarmers = async (key, serverUrl) => {
    const localItems = JSON.parse(localStorage.getItem(key)) || [];
  
    for (const item of localItems) {
      try {
        // Check if the item already exists on the server
        const response = await axios.get(`http://localhost:8081/readFarmer/${item.id}`);
  
        // If it exists, skip the insertion
        if (response.data) {
          //console.log(`Item with id ${item.id} already exists. Skipping.`);
          await axios.patch(`http://localhost:8081/updateFarmer/${item.id}`, item);
        console.log(`Updated item with id ${item.id}`);
        continue;
        }
      } catch (error) {
        // If the item doesn't exist, proceed with insertion
        if (error.response && error.response.status === 404) {
          try {
            await axios.post(serverUrl, item);
            console.log(`Inserted item with id ${item.id}`);
          } catch (postError) {
            console.log(`Failed to insert item with id ${item.id}`, postError);
          }
        } else {
          console.log(`Failed to check item with id ${item.id}`, error);
        }
      }
      deleteItemFromLocalStorage(key,item.id);
    }
    clearLocalStorage(key);
  };
  
  
  