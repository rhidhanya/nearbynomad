"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Compass } from "lucide-react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async () => {
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      console.log('Sending request:', { email, password });
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
      if (isLogin) {
        // LOGIN FLOW
        const res = await fetch(`${backendUrl}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        setLoading(false);

        if (res.ok) {
          router.push("/mood");
        } else {
          alert(data.message || "Login failed");
        }
      } else {
        // SIGNUP FLOW → SEND OTP
        const res = await fetch(`${backendUrl}/api/auth/send-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        console.log('Response:', { status: res.status, data });
        setLoading(false);

        if (res.ok) {
          setOtpSent(true);
          alert("OTP sent to your email!");
        } else {
          alert(data.message || `Error sending OTP (Status: ${res.status})`);
        }
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setLoading(false);
      alert("Network error: " + error.message);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return alert("Enter the OTP");

    setLoading(true);
    try {
      console.log('Verifying OTP:', { email, otp });
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
      const res = await fetch(`${backendUrl}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      console.log('Response:', { status: res.status, data });
      setLoading(false);

      if (res.ok) {
        alert("Account verified successfully!");
        router.push("/mood");
      } else {
        alert(data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error('Fetch error:', error);
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
          <h2 className="text-2xl font-semibold text-black">
            {otpSent ? "Verify Your Account" : isLogin ? "Welcome Back, Explorer!" : "Start Your Adventure"}
          </h2>
          <p className="text-gray-600 mt-2">
            {otpSent
              ? "Check your email for the verification code."
              : isLogin
              ? "Sign in to find your next adventure."
              : "Join us to discover places that match your mood."}
          </p>
        </div>

        {/* Forms */}
        {!otpSent ? (
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-800 font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg py-5 border-2 border-gray-300 focus:border-gray-600 focus:ring-2 focus:ring-gray-400 transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-800 font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-lg py-5 border-2 border-gray-300 focus:border-gray-600 focus:ring-2 focus:ring-gray-400 transition-all duration-300"
              />
            </div>

            <Button
              type="button"
              onClick={handleAuth}
              disabled={loading}
              className="w-full rounded-lg py-5 text-lg bg-black text-white hover:bg-gray-800 hover:scale-105 transition-all duration-300"
            >
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Send OTP"}
            </Button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-gray-800 font-medium">
                Enter OTP
              </Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter the code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="rounded-lg py-5 border-2 border-gray-300 focus:border-gray-600 focus:ring-2 focus:ring-gray-400 transition-all duration-300"
              />
            </div>
            <Button
              type="button"
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full rounded-lg py-5 text-lg bg-black text-white hover:bg-gray-800 hover:scale-105 transition-all duration-300"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
          </div>
        )}

        {!otpSent && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-gray-600 hover:text-black transition-colors duration-300"
            >
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span className="font-semibold text-gray-800 hover:text-black"> {isLogin ? "Sign up" : "Sign in"}</span>
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}