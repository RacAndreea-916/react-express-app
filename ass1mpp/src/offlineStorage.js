import { openDB } from 'idb';
import axios from 'axios';

// Function to open the IndexedDB database
const openDatabase = async () => {
  return await openDB('MyAppDatabase', 3, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('cows')) {
        db.createObjectStore('cows', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('syncQueue')) {
        db.createObjectStore('syncQueue', { autoIncrement: true }); // Sync queue for offline additions
      }
    }
  });
};




// Add a cow to IndexedDB
const addItem = async (item) => {
  const db = await openDatabase();
  const tx = db.transaction("cows", "readwrite");
  const store = tx.objectStore("cows");

  const existingItem = await store.get(item.id); // Check if key exists
  if (existingItem) {
    console.log("Item already exists, skipping add");
  } else {
    await store.add(item); // Only add if key does not exist
  }

  await tx.done;
};

// Get all cows from IndexedDB
const getAllItems = async () => {
  const db = openDatabase();
  const tx = (await db).transaction('cows', 'readonly');
  const store = tx.objectStore('cows');
  const items = await store.getAll();
  await tx.done;
  return items;
};

// Example function with error handling
const addItemToSyncQueue = async (item) => {
  try {
    const db = await openDatabase(); // Ensure the database is opened
    const tx = db.transaction('syncQueue', 'readwrite'); // Ensure the correct transaction type
    const store = tx.objectStore('syncQueue');
    await store.add(item); // Add item to the syncQueue
    await tx.done; // Complete the transaction
  } catch (error) {
    console.error('Error adding item to syncQueue:', error); // Log the error
  }
};


// Update a cow in IndexedDB
export const updateItem = async (id, updatedCow) => {
  const db = await openDatabase();
  const tx = db.transaction('cows', 'readwrite');
  const store = tx.objectStore('cows');
  await store.put({ ...updatedCow, id }); // Update cow in IndexedDB
  await tx.done;
};

// Delete a cow from IndexedDB


const clearIndexedDB = async () => {
  const db = await openDatabase();
  const tx = db.transaction("cows", "readwrite");
  const store = tx.objectStore("cows");

  await store.clear(); // Clear all data
  await tx.done;
};

//Sync offline data with the server when back online
const syncWithServer = async () => {
  const db = await openDatabase();
  const tx = db.transaction('syncQueue', 'readwrite');
  const store = tx.objectStore('syncQueue');
  const allItems = await store.getAll();

  for (const cow of allItems) {
    try {
      const { id, ...data } = cow;

      try {
        const response = await axios.get(`http://localhost:8081/read/${id}`);
        if (response.status === 200) {
          // Update existing cow on the server
         // await axios.patch(`http://localhost:8081/update/${id}`, data);
        } else {
          // Add new cow to the server if it doesn't exist
          await axios.post('http://localhost:8081/cow', cow);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          // If cow does not exist on the server, add it
          console.log("this was not foung");
          await axios.post('http://localhost:8081/cow', cow);
        }
      }
    } catch (err) {
      console.error("Error during synchronization:", err);
    }
  }

 
  //await store.clear();
  await tx.done;
};



// const syncWithServer = async () => {
//   const db = await openDatabase();
//   const syncTx = db.transaction('syncQueue', 'readwrite');
//   const syncStore = syncTx.objectStore('syncQueue');

//   try {
//     const itemsToSync = await syncStore.getAll(); // Ensure transaction stays open while getting items

//     for (const item of itemsToSync) {
//       if (!item.id) {
//         console.error("Skipping item with undefined ID:", item);
//         continue; // Safely skip invalid items
//       }

//       try {
//         // Example: Ensure server interaction and transaction integrity
//         const response = await axios.get(`http://localhost:8081/read/${item.id}`);
//         if (response.status === 200) {
//           // Handle existing item
//         } else {
//           // Handle new item or other cases
//         }
//       } catch (err) {
//         if (err.response?.status === 404) {
//           // Item not found, handle accordingly
//         } else {
//           throw err; // Re-throw unknown errors
//         }
//       }
//     }

//     await syncStore.clear(); // Clear sync queue only if transaction is active
//     await syncTx.done; // Ensure transaction is completed
//   } catch (error) {
//     console.error("Error during syncWithServer:", error);
//     await syncTx.abort(); // Abort transaction on error
//   }
// };



export { addItemToSyncQueue,getAllItems, syncWithServer, addItem, clearIndexedDB,  openDatabase };