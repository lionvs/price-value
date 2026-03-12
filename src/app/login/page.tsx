"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { verifyCaptcha } from "@/app/actions";
import { useReCaptcha } from "@/components/auth/ReCaptchaProvider";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, user, isHydrated } = useAuth();
  const router = useRouter();
  const { executeRecaptcha } = useReCaptcha();

  useEffect(() => {
    if (user) {
      router.push("/account");
    }
  }, [user, router]);

  if (!isHydrated || user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    if (!executeRecaptcha) {
      setError("Recaptcha not ready");
      return;
    }

    const token = await executeRecaptcha("login");
    const captchaVerification = await verifyCaptcha(token, "login", undefined, {email}, process.env.NEXT_PUBLIC_RECAPTCHA_LOGIN_SITE_KEY);

    if (!captchaVerification.success) {
      setError(captchaVerification.message || "Captcha verification failed");
      return;
    }

    const result = login(email, password);
    if (result.success) {
      router.push("/account");
    } else {
      setError(result.error || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-pv-gray-900 text-center mb-6">
          Sign In
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-pv-red text-sm rounded-md p-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-pv-gray-900 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border border-pv-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pv-blue focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-pv-gray-900 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full border border-pv-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pv-blue focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-pv-yellow text-pv-gray-900 font-bold py-3 rounded-md hover:bg-pv-yellow-dark transition-colors"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-pv-gray-500">
          <p>Forgot your password? <span className="text-pv-blue hover:underline cursor-pointer">Reset it here</span></p>
          <p className="mt-3">Don&apos;t have an account? <span className="text-pv-blue hover:underline cursor-pointer">Create one</span></p>
        </div>
      </div>
    </div>
  );
}
