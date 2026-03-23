import { createContext, useContext, useEffect, useState } from "react";

const SettingsContext = createContext(null);



const defaultUser = {
  name: "Niranjan Singh",
  email: "niranjan.ks@anantdv.com",
  role: "Admin",
  avatar: "NS",
  phone: "+91 98300 12345",
  joined: "January 2024",
};

export function SettingsProvider({ children }) {
  const [user, setUser] = useState(defaultUser);
  const [warehouses, setWarehouses] = useState([])
  const [selectedWarehouse, setSelectedWarehouse] = useState();
  const [theme, setTheme] = useState("dark");

  const updateUser = (fields) => setUser((prev) => ({ ...prev, ...fields }));

  const getWarehouseForUser = async () => {
  try {
    const userRes = await fetch(
      "http://192.168.101.182:81/api/method/frappe.auth.get_logged_user",
      {
        headers: {
          Authorization: "token 661457e17b8612a:32a5ddcc5a9c177",
        },
      }
    );

    const userData = await userRes.json();

    const warehouseRes = await fetch(
      "http://192.168.101.182:81/api/method/moneygram.api.get_user_warehouse",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "token 661457e17b8612a:32a5ddcc5a9c177",
        },
        credentials: "include",
        body: JSON.stringify({ user: userData.message.email }),
      }
    );

    const warehouseData = await warehouseRes.json();

    return warehouseData?.message; // ✅ NOW this works
  } catch (error) {
    console.error("Error fetching warehouse:", error);
    return null;
  }
};
   
  useEffect(() => {
    getWarehouseForUser().then(r => {
        setWarehouses(r)
        setSelectedWarehouse(r[0])
    })
  }, [])
  

  return (
    <SettingsContext.Provider
      value={{
        user,
        updateUser,
        selectedWarehouse,
        setSelectedWarehouse,
        warehouses,
        theme,
        setTheme,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within <SettingsProvider>");
  return ctx;
}