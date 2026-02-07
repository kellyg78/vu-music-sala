"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login - in production, this would call an API
    if (email && password) {
      localStorage.setItem("isAuthenticated", "true");
      router.push("/dashboard");
    }
  };

  return (
    <main className="min-h-screen grid-background relative overflow-hidden flex items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-vaporwave-purple/20 via-vaporwave-dark to-vaporwave-darker opacity-90" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-vaporwave-purple/20 backdrop-blur-lg rounded-2xl p-8 border-2 border-neon-purple/50 neon-border">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <Image 
              src="https://private-us-east-1.manuscdn.com/sessionFile/o4kupod5v9oPEqaV57274n/sandbox/hw5d83zEhZcNkxD5LiW7zS-img-1_1770437710000_na1fn_dnUtbXVzaWMtc2FsYS1sb2dv.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvbzRrdXBvZDV2OW9QRXFhVjU3Mjc0bi9zYW5kYm94L2h3NWQ4M3pFaFpjTmt4RDVMaVc3elMtaW1nLTFfMTc3MDQzNzcxMDAwMF9uYTFmbl9kblV0YlhWemFXTXRjMkZzWVMxc2IyZHYucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=rd4zqo-3eNnP6CoWNAnPN~atiwIkqrUGPB4-CxdoOVd82z2uttMX-o0YtW6rEt-1xAH5svfyocN75eyzj0QYl2pfBp4Re9ostc6CKCwVkx58T6bUW0C1C18w5k9YU2cr7moaIkfnmMIr30hxWP~uVrkhy31wtKSA0h3W8eQokNkErR9crfU~LqLTVijnRD4-o-V3-M3S8w6dkHriRmZ01GetoT5YmW5uxPpo74tHmeV9XFSn5CXEd5CjliDEykHFP7WlB9j9nl467NBbjAL9Ds8Go3ENVkmGish-KCcuGYgMPufjtkgF5ptAG275H0CvAbUpfP7CPPGrqOLHERCBbg__"
              alt="VU Music Sala Logo"
              width={80}
              height={80}
              className="mb-4"
            />
            <h1 className="text-3xl font-pixel text-neon-cyan neon-text mb-2">
              Welcome Back!
            </h1>
            <p className="text-gray-400 font-retro text-sm">
              We're so excited to see you again!
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-retro text-neon-pink mb-2">
                Email or Username*
              </label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-vaporwave-darker/50 border-2 border-neon-purple/30 rounded-lg text-white font-retro focus:border-neon-cyan focus:outline-none transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-retro text-neon-pink mb-2">
                Password*
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-vaporwave-darker/50 border-2 border-neon-purple/30 rounded-lg text-white font-retro focus:border-neon-cyan focus:outline-none transition-colors"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="button"
              className="text-sm text-neon-cyan hover:text-neon-pink transition-colors font-retro"
            >
              Forgot your password?
            </button>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-neon-pink to-neon-purple rounded-lg font-retro font-bold text-white neon-border border-2 border-neon-pink hover:scale-105 transition-transform"
            >
              Log In
            </button>

            <div className="text-center">
              <span className="text-gray-400 font-retro text-sm">
                Need an account?{" "}
              </span>
              <Link href="/register" className="text-neon-cyan hover:text-neon-pink transition-colors font-retro text-sm font-bold">
                Register
              </Link>
            </div>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-neon-purple hover:text-neon-cyan transition-colors font-retro text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
