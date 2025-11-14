import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthAdminStore from "../../store/AuthAdminStore.js";
import GeneralInfoStore from "../../store/GeneralInfoStore.js";

const AdminLogin = () => {
  const { GeneralInfoList } = GeneralInfoStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true); // ⬅️ new state

  const { login, error, loading, token } = useAuthAdminStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  useEffect(() => {
    if (token && !isTokenExpired(token)) {
      navigate("/admin/dashboard");
    } else {
      setCheckingAuth(false);
    }
  }, [token, navigate]);

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-tl primaryBgColor">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
          <p className="mt-4 text-white text-sm">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gradient-to-tl primaryBgColor
    "
    >
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-center text-2xl font-semibold text-gray-700">
          {GeneralInfoList?.CompanyName}
        </h2>
        <h2 className="mb-4 text-center text-2xl font-semibold text-gray-700">
          Admin Panel
        </h2>
        <h2 className="  text-gray-700">Welcome Back!</h2>
        <h2 className="mb-4 text-gray-700">
          Enter your email address and password to access admin panel.
        </h2>

        {error && (
          <p className="mb-4 rounded-md bg-red-200 p-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer rounded-md primaryBgColor px-4 py-2 accentTextColor hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
