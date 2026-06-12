import { useState } from "react";
import { Eye, EyeOff, Leaf, AlertCircle } from "lucide-react";
import api from "../services/api";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleLogin() {
    setError("");

    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      // OAuth2PasswordRequestForm expects form data, not JSON
      const form = new URLSearchParams();
      form.append("username", username);
      form.append("password", password);

      const { data } = await api.post("/auth/login", form, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      // Store token so api.js can attach it to future requests
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);

      onLogin();
    } catch (err) {
      const msg = err.response?.data?.detail || "Invalid username or password.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleLogin();
  }

  return (
    <div className="min-h-screen bg-offwhite flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-forest rounded-2xl flex items-center justify-center mb-3 shadow-sm">
            <Leaf size={28} className="text-amber" />
          </div>
          <h1 className="text-xl font-semibold text-charcoal">BananaGuard AI</h1>
          <p className="text-sm text-gray-400 mt-1">Talakag Banana Farm — Admin Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-charcoal mb-5">Sign in to your account</h2>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-3 py-2.5 mb-4">
              <AlertCircle size={14} className="shrink-0" />
              {error}
            </div>
          )}

          {/* Username */}
          <div className="mb-4">
            <label className="text-xs font-medium text-gray-500 block mb-1">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="text-xs font-medium text-gray-500 block mb-1">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 pr-10"
              />
              <button
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-forest hover:bg-forest-light disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-5">
          BananaGuard AI — UAV-Based Banana Disease Detection System
        </p>
      </div>
    </div>
  );
}