import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api/axios";

import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCpu,
} from "react-icons/fi";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/users/login", {
        email,
        password,
      });

      const token = response.data.data.token;

      localStorage.setItem("token", token);

      navigate("/dashboard");
    } catch (error: unknown) {
      console.error("Login failed", error);

      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;

      setError(
        message || "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-slate-950 text-white flex items-center justify-center px-4 py-4 relative overflow-hidden">

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />

        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-5">

          <div className="mx-auto mb-3 w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <FiCpu className="w-6 h-6" />
          </div>

          <h1 className="text-xl font-bold tracking-tight">
            AI Knowledge Assistant
          </h1>

          <p className="text-slate-400 mt-1 text-xs">
            Your intelligent knowledge workspace
          </p>

        </div>

        {/* Login Card */}
        <div className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl">

          <div className="mb-5">
            <h2 className="text-xl font-semibold">
              Welcome back
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Sign in to continue to your workspace
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Email */}
            <div>

              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Email address
              </label>

              <div className="relative">

                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />

                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-900/70 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10"
                />

              </div>

            </div>

            {/* Password */}
            <div>

              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Password
              </label>

              <div className="relative">

                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-900/70 border border-white/10 rounded-xl py-2.5 pl-11 pr-12 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? (
                    <FiEyeOff className="w-5 h-5" />
                  ) : (
                    <FiEye className="w-5 h-5" />
                  )}
                </button>

              </div>

            </div>

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between text-sm">

              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">

                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-700 bg-slate-900"
                />

                Remember me

              </label>

              <button
                type="button"
                className="text-blue-400 hover:text-blue-300 transition"
              >
                Forgot password?
              </button>

            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 py-2.5 text-sm font-semibold shadow-lg shadow-blue-500/20 transition hover:from-blue-400 hover:to-purple-500 disabled:opacity-60 disabled:cursor-not-allowed"
            >

              {loading ? (
                <span className="flex items-center justify-center gap-2">

                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                  Signing in...

                </span>
              ) : (
                "Sign in"
              )}

            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">

            <div className="h-px flex-1 bg-white/10" />

            <span className="text-xs text-slate-500">
              AI-powered knowledge
            </span>

            <div className="h-px flex-1 bg-white/10" />

          </div>

          {/* Register */}
          <p className="text-center text-sm text-slate-400">

            New to the platform?{" "}

            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-blue-400 font-medium hover:text-blue-300 transition"
            >
              Create an account
            </button>

          </p>

        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-600 mt-4">
          Secure authentication • AI-powered • Built for your knowledge
        </p>

      </div>

    </div>
  );
};

export default Login;

