import { useEffect, useState } from "react";

const API_URL =
  "http://192.168.101.182:81/api/method/frappe.auth.get_logged_user";

const HEADERS = {
  "Content-Type": "application/json",
  Authorization: "token 661457e17b8612a:32a5ddcc5a9c177",
};

export function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  

  async function fetchUser() {
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: HEADERS
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const result = await response.json();
      setUser(result.message || {});
    } catch (err) {
      console.error("Failed to fetch user", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, loading, error };
}