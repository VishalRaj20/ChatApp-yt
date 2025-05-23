import React, { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";
import { apiClient } from "@/lib/api-client.js";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { Mail, Lock, UserPlus, LogIn } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validateSignup = () => {
    if (!email.length) return toast.error("Email is required");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return toast.error("Invalid email");
    if (!password) return toast.error("Password is required");
    if (password.length < 6)
      return toast.error("Password must be at least 6 characters");
    if (password !== confirmPassword) return toast.error("Passwords do not match");
    return true;
  };

  const handleSignup = async () => {
    if (validateSignup()) {
      try {
        const response = await apiClient.post(
          SIGNUP_ROUTE,
          { email, password },
          { withCredentials: true }
        );
        if (response.status === 201) {
          setUserInfo(response.data.user);
          toast.success("Signup successful!");
          navigate("/profile");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
        }
      } catch (error) {
        if (error.response?.status === 409) {
          toast.error("User already exists.");
        } else {
          toast.error(error.response?.data?.error || "Signup failed.");
        }
      }
    }
  };

  const handleLogin = async () => {
    if (!email || !password) return toast.error("Email and Password required");
    try {
      const response = await apiClient.post(
        LOGIN_ROUTE,
        { email, password },
        { withCredentials: true }
      );
      if (response.data.user.id) {
        setUserInfo(response.data.user);
        toast.success("Login successful!");
        setEmail("");
        setPassword("");
        navigate(response.data.user.profile ? "/chat" : "/profile");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-500 p-5">
      <Toaster position="top-center" />
      <div className="backdrop-blur-md bg-white/30 shadow-2xl rounded-3xl w-full max-w-5xl grid md:grid-cols-2 p-10">
        {/* Left */}
        <div className="flex flex-col justify-center gap-8 p-5">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white">Welcome 👋</h1>
            <p className="text-white/90 mt-2 font-medium">
              Fill in the details to get started with the best chat app!
            </p>
          </div>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid grid-cols-2 bg-white/30 rounded-full mb-6">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 font-semibold rounded-full"
              >
                <LogIn className="inline mr-2 w-4 h-4" />
                Login
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 font-semibold rounded-full"
              >
                <UserPlus className="inline mr-2 w-4 h-4" />
                Signup
              </TabsTrigger>
            </TabsList>

            {/* Login */}
            <TabsContent value="login" className="flex flex-col gap-5">
              <Input
                placeholder="Email"
                type="email"
                icon={<Mail />}
                className="rounded-xl p-6"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                icon={<Lock />}
                className="rounded-xl p-6"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-6 font-semibold transition-all cursor-pointer"
                onClick={handleLogin}
              >
                Login
              </Button>
            </TabsContent>

            {/* Signup */}
            <TabsContent value="signup" className="flex flex-col gap-5">
              <Input
                placeholder="Email"
                type="email"
                icon={<Mail />}
                className="rounded-xl p-6"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                icon={<Lock />}
                className="rounded-xl p-6"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                placeholder="Confirm Password"
                type="password"
                className="rounded-xl p-6"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-6 font-semibold transition-all cursor-pointer"
                onClick={handleSignup}
              >
                Signup
              </Button>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right */}
        <div className="hidden md:flex justify-center items-center p-5">
          <img
            src="https://png.pngtree.com/png-vector/20220630/ourmid/pngtree-online-chat-messages-text-notification-on-mobile-phone-png-image_5633357.png"
            alt="auth-art"
            className="w-full h-auto object-contain drop-shadow-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
