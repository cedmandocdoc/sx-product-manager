const getLocalStorageItem = (key: string) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error getting localStorage item:', error);
    return null;
  }
};

export default getLocalStorageItem;