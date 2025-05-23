export const createAuthSlice = (set) => {
  // Check localStorage for existing userInfo
  const storedUser = localStorage.getItem("userInfo");
  return {
    userInfo: storedUser ? JSON.parse(storedUser) : undefined,
    setUserInfo: (userInfo) => {
      if (userInfo) {
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
      } else {
        localStorage.removeItem("userInfo");
      }
      set({ userInfo });
    }
  };
};
