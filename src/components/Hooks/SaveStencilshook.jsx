import React, { useState } from "react";

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error loading data from local storage:", error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      setStoredValue(value);
    } catch (error) {
      console.error("Error saving data to local storage:", error);
    }
  };

  return [storedValue, setValue];
}

function useHeadlineInputLists(initialValue, storageKey) {
  const [headlineInputLists, setHeadlineInputLists] = useLocalStorage(
    storageKey,
    initialValue
  );

  return {
    headlineInputLists,
    addHeadlineInputList: (headline, inputList) => {
      const newObject = { headline, inputList };

      setHeadlineInputLists([...headlineInputLists, newObject]);
    },
  };
}

export default useHeadlineInputLists;
