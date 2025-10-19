"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Compass, Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
      const res = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        // Store user data if needed
        localStorage.setItem("userData", JSON.stringify(data.user || {}));
        router.push("/mood");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      alert("Network error: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 rounded-lg border border-gray-300 bg-white shadow-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <Compass className="w-8 h-8 text-gray-800 transition-transform duration-300 hover:rotate-12" />
          <h1 className="text-3xl font-bold text-black">NearbyNomad</h1>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-black">Welcome Back, Explorer!</h2>
          <p className="text-gray-600 mt-2">Sign in to find your next adventure.</p>
        </div>

        {/* Login Form */}
        <form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-800 font-medium">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 rounded-lg py-5 border-2 border-gray-300 focus:border-gray-600 focus:ring-2 focus:ring-gray-400 transition-all duration-300"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-800 font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 rounded-lg py-5 border-2 border-gray-300 focus:border-gray-600 focus:ring-2 focus:ring-gray-400 transition-all duration-300"
              />
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <Button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="w-full rounded-lg py-5 text-lg bg-black text-white hover:bg-gray-800 hover:scale-105 transition-all duration-300"
          >
            {loading ? "Signing In..." : "Sign In"}
            {!loading && <ArrowRight className="w-5 h-5 ml-2" />}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Link href="/signup" className="text-sm text-gray-600 hover:text-black transition-colors duration-300 flex items-center justify-center gap-2">
            Don't have an account? 
            <span className="font-semibold text-gray-800 hover:text-black">Create one</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Card>
    </div>
  );
}