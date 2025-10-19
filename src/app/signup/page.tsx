"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Compass, ArrowLeft, Mail, Lock, User } from "lucide-react";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
      const res = await fetch(`${backendUrl}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: formData.name,
          email: formData.email, 
          password: formData.password 
        }),
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setOtpSent(true);
        alert("OTP sent to your email! Please check your inbox.");
      } else {
        alert(data.message || "Error creating account");
      }
    } catch (error) {
      console.error('Sign up error:', error);
      setLoading(false);
      alert("Network error: " + error.message);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      alert("Please enter the OTP");
      return;
    }

    setLoading(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
      const res = await fetch(`${backendUrl}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: formData.email, 
          otp: otp 
        }),
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        alert("Account created successfully!");
        router.push("/mood");
      } else {
        alert(data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setLoading(false);
      alert("Network error: " + error.message);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
      const res = await fetch(`${backendUrl}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: formData.name,
          email: formData.email, 
          password: formData.password 
        }),
      });
      setLoading(false);
      alert("OTP resent to your email!");
    } catch (error) {
      setLoading(false);
      alert("Error resending OTP");
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
            {otpSent ? "Verify Your Account" : "Create Your Account"}
          </h2>
          <p className="text-gray-600 mt-2">
            {otpSent
              ? "Check your email for the verification code."
              : "Join us to discover places that match your mood."}
          </p>
        </div>

        {/* Forms */}
        {!otpSent ? (
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-800 font-medium">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="pl-10 rounded-lg py-5 border-2 border-gray-300 focus:border-gray-600 focus:ring-2 focus:ring-gray-400 transition-all duration-300"
                />
              </div>
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

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
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="pl-10 rounded-lg py-5 border-2 border-gray-300 focus:border-gray-600 focus:ring-2 focus:ring-gray-400 transition-all duration-300"
                />
              </div>
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-800 font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="pl-10 rounded-lg py-5 border-2 border-gray-300 focus:border-gray-600 focus:ring-2 focus:ring-gray-400 transition-all duration-300"
                />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
            </div>

            <Button
              type="button"
              onClick={handleSignUp}
              disabled={loading}
              className="w-full rounded-lg py-5 text-lg bg-black text-white hover:bg-gray-800 hover:scale-105 transition-all duration-300"
            >
              {loading ? "Creating Account..." : "Create Account"}
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
                placeholder="Enter the 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="rounded-lg py-5 border-2 border-gray-300 focus:border-gray-600 focus:ring-2 focus:ring-gray-400 transition-all duration-300 text-center text-lg tracking-widest"
                maxLength={6}
              />
              <p className="text-sm text-gray-600 text-center">
                We sent a 6-digit code to <strong>{formData.email}</strong>
              </p>
            </div>
            
            <div className="space-y-3">
              <Button
                type="button"
                onClick={handleVerifyOtp}
                disabled={loading || otp.length !== 6}
                className="w-full rounded-lg py-5 text-lg bg-black text-white hover:bg-gray-800 hover:scale-105 transition-all duration-300"
              >
                {loading ? "Verifying..." : "Verify & Create Account"}
              </Button>
              
              <Button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                variant="outline"
                className="w-full rounded-lg py-3 border-2 border-gray-300 bg-white hover:bg-gray-50 transition-all duration-300"
              >
                {loading ? "Sending..." : "Resend OTP"}
              </Button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm text-gray-600 hover:text-black transition-colors duration-300 flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Already have an account? Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
}
