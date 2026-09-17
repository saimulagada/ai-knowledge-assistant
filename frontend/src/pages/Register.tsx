import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCpu } from "react-icons/fi";
import api from "../api/axios";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/users/register", {
        name,
        email,
        password,
      });

      console.log("Registration successful:", response.data);

      navigate("/login");
    } catch (error: unknown) {
      console.error("Registration failed:", error);

      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;

      setError(
        message || "Unable to create your account. Please try again."
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

      <div className="relative w-full max-w-2xl">

        {/* Branding */}
        <div className="text-center mb-4">

          <div className="mx-auto mb-3 w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <FiCpu className="w-6 h-6" />
          </div>

          <h1 className="text-xl font-bold tracking-tight">
            AI Knowledge Assistant
          </h1>

          <p className="text-slate-400 mt-1 text-xs">
            Build your personal AI-powered knowledge base
          </p>

        </div>

        {/* Register Card */}
        <div className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl">

          {/* Header */}
          <div className="mb-4">

            <h2 className="text-xl font-semibold">
              Create your account
            </h2>

            <p className="text-xs text-slate-400 mt-1">
              Start building your AI knowledge workspace
            </p>

          </div>

          <form onSubmit={handleRegister} className="space-y-4">

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">

            {/* Name */}
            <div>

              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Full name
              </label>

              <div className="relative">

                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />

                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-slate-900/70 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10"
                />

              </div>

            </div>

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
                  placeholder="Create a password"
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

            {/* Confirm Password */}
            <div>

              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Confirm password
              </label>

              <div className="relative">

                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />

                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-slate-900/70 border border-white/10 rounded-xl py-2.5 pl-11 pr-12 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <FiEyeOff className="w-5 h-5" />
                  ) : (
                    <FiEye className="w-5 h-5" />
                  )}
                </button>

              </div>

            </div>

            </div>

            {/* Terms */}
            <label className="flex items-start gap-2 text-xs text-slate-500 cursor-pointer">

              <input
                type="checkbox"
                required
                className="w-4 h-4 mt-0.5 rounded border-slate-700 bg-slate-900"
              />

              <span>
                I agree to the{" "}
                <button
                  type="button"
                  className="text-blue-400 hover:text-blue-300"
                >
                  Terms of Service
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  className="text-blue-400 hover:text-blue-300"
                >
                  Privacy Policy
                </button>
                .
              </span>

            </label>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 py-2.5 text-sm font-semibold shadow-lg shadow-blue-500/20 transition hover:from-blue-400 hover:to-purple-500 disabled:opacity-60 disabled:cursor-not-allowed"
            >

              {loading ? (
                <span className="flex items-center justify-center gap-2">

                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                  Creating account...

                </span>
              ) : (
                "Create account"
              )}

            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">

            <div className="h-px flex-1 bg-white/10" />

            <span className="text-xs text-slate-500">
              AI-powered knowledge
            </span>

            <div className="h-px flex-1 bg-white/10" />

          </div>

          {/* Login */}
          <p className="text-center text-sm text-slate-400">

            Already have an account?{" "}

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-blue-400 font-medium hover:text-blue-300 transition"
            >
              Sign in
            </button>

          </p>

        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-600 mt-3">
          Secure authentication • AI-powered • Built for your knowledge
        </p>

      </div>

    </div>
  );
};

export default Register;

