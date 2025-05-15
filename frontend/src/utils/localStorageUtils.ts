export const getUserInLocalStorageItem = (): null | string => {
  if (typeof window !== "undefined") {
    const item = localStorage.getItem("user");
    return item ? item : null;
  }
  return null;
};
