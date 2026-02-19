import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const ERPNEXT_BASE_URL = "http://192.168.101.182";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const loginToERPNext = async (username, password) => {
    try {
      const response = await fetch(
        `${ERPNEXT_BASE_URL}/api/method/login`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ usr: username, pwd: password }),
          credentials: "include",
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! ${response.status}`);

      const result = await response.json();
      return { success: true, data: result };
    } catch (err) {
      return {
        success: false,
        error: err.message || "Login failed",
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);

    try {
      const loginResult = await loginToERPNext(
        formData.email,
        formData.password
      );

      if (
        loginResult.success &&
        (loginResult.data.message === "Logged In" ||
          loginResult.data.home_page)
      ) {
        const sessionData = {
          user: loginResult.data.full_name || formData.email,
          email: formData.email,
          loginTime: new Date().toISOString(),
          sessionActive: true,
        };

        localStorage.setItem(
          "erpnext_session",
          JSON.stringify(sessionData)
        );

        navigate("/home");
      } else {
        setError(
          loginResult?.data?.message || "Invalid credentials"
        );
      }
    } catch (err) {
      setError("Unexpected error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    formData.email.trim() !== "" &&
    formData.password.trim() !== "";

  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-[var(--color-background-light)] flex items-center justify-center px-6 py-16 font-sans">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Login
          </h2>

          <p className="text-gray-500 text-center mb-6">
            Access your account to manage transfers.
          </p>

          {error && (
            <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />

                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 select-none"
                >
                  {showPassword ? "🙈" : "👁"}
                </span>
              </div>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="w-full bg-[var(--color-primary)] hover:opacity-90 text-black font-semibold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                "Login"
              )}
            </button>

            <p className="text-sm text-center text-gray-500">
              Don’t have an account?{" "}
              <a href="#" className="text-[var(--color-primary)] font-medium">
                Register
              </a>
            </p>

          </form>
        </div>
      </section>

      {/* <Footer /> */}
    </>
  );
}
