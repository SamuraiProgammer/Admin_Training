import axios from "axios";

export const getPersistedAdminUser = () => {
  try {
    const raw = localStorage.getItem("persist:root");
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    const userDetails = parsed.userDetails ? JSON.parse(parsed.userDetails) : null;
    return userDetails?.currentUser || null;
  } catch (error) {
    console.error("Failed to parse persisted admin session", error);
    return null;
  }
};

export const applyPersistedAdminAuth = () => {
  const currentUser = getPersistedAdminUser();

  if (currentUser?.token) {
    axios.defaults.headers.common.Authorization = `Bearer ${currentUser.token}`;
    return currentUser;
  }

  delete axios.defaults.headers.common.Authorization;
  return null;
};
