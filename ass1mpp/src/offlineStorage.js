import { openDB } from 'idb';
import axios from 'axios';

// Function to open the IndexedDB database
const openDatabase = async () => {
  return await openDB('MyAppDatabase', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('cows')) {
        db.createObjectStore('cows', { keyPath: 'id' });
      }
    },
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

// Update a cow in IndexedDB
export const updateItem = async (id, updatedCow) => {
  const db = await openDatabase();
  const tx = db.transaction('cows', 'readwrite');
  const store = tx.objectStore('cows');
  await store.put({ ...updatedCow, id }); // Update cow in IndexedDB
  await tx.done;
};

// Delete a cow from IndexedDB
export const deleteItem = async (id) => {
  const db = await openDatabase();
  const tx = db.transaction('cows', 'readwrite');
  const store = tx.objectStore('cows');
  await store.delete(id); // Delete cow from IndexedDB
  await tx.done;
};

const clearIndexedDB = async () => {
  const db = await openDatabase();
  const tx = db.transaction("cows", "readwrite");
  const store = tx.objectStore("cows");

  await store.clear(); // Clear all data
  await tx.done;
};

// Sync offline data with the server when back online
const syncWithServer = async () => {
  const db = await openDatabase();
  const tx = db.transaction('cows', 'readwrite');
  const store = tx.objectStore('cows');
  const allItems = await store.getAll();

  for (const cow of allItems) {
    try {
      const { id, ...data } = cow;

      try {
        const response = await axios.get(`http://localhost:8081/read/${id}`);
        if (response.status === 200) {
          // Update existing cow on the server
          await axios.patch(`http://localhost:8081/update/${id}`, data);
        } else {
          // Add new cow to the server if it doesn't exist
          await axios.post('http://localhost:8081/cow', cow);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          // If cow does not exist on the server, add it
          await axios.post('http://localhost:8081/cow', cow);
        }
      }
    } catch (err) {
      console.error("Error during synchronization:", err);
    }
  }

  await store.clear();
  await tx.done;
};
export { getAllItems, syncWithServer, addItem, clearIndexedDB };