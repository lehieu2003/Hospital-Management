import React, { createContext, useState, ReactNode } from 'react';


// Định nghĩa kiểu dữ liệu cho Context
interface UserContextType {
  userId: string | null; // userId có thể là chuỗi hoặc null
  setUserId: (id: string | null) => void; // Hàm để cập nhật userId
}

// Tạo Context với giá trị mặc định ban đầu
export const UserContext = createContext<UserContextType>({
  userId: null,
  setUserId: () => { }, // Giá trị mặc định, sẽ được override bởi Provider
});

// Định nghĩa kiểu cho props của Provider
interface UserProviderProps {
  children: ReactNode; // Các thành phần con
}

// Provider Component
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

