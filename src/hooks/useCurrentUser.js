import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";



export function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loginUser = useUser();







  async function fetchUser() {
    console.log("loginUser", loginUser.user)
    const API_URL =
      "http://182.71.135.110:82/api/method/frappe.auth.get_logged_user";

    const HEADERS = {
      "Content-Type": "application/json",
      Authorization: `token ${loginUser?.user?.api_key}:${loginUser?.user?.api_secret}`,
    };
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: HEADERS,
        credentials: "include",
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
  }, [loginUser]);

  return { user, loading, error };
}