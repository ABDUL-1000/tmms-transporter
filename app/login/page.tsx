"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function SignupFormDemo() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    console.log('token' ,token);

    const options = {
      method: "POST",
      url: "https://test.tmmmsapp.com/api/login",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // Authorization:
        //   `Bearer ${token}`,
      },
      data: {
        email,
        password,
      },
    };

    try {
      const { data } = await axios.request(options);
      console.log(data);
      toast.success("Login successful!");
      if (data.token) {
        document.cookie = `token=${data.token}; path=/; max-age=86400; secure; samesite=lax`;
      }
      setTimeout(() => {
        router.push("/");
        
      },10000)
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Login failed. Check your credentials.");
    }
  };

  return (
    <div className="shadow-input h-[80%] mx-auto mt-8 w-full max-w-md rounded-none border-2 border-gray-800 bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
      <Toaster position="top-center" />
      <h2 className="text-sm uppercase text-center font-bold text-neutral-800 dark:text-neutral-200">
        Welcome Back
      </h2>

      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email" className="text-[0.8rem]">
            Email Address
          </Label>
          <Input
            id="email"
            placeholder="projectmayhem@fc.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <BottomGradient />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="password" className="text-[0.8rem]">
            Password
          </Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </LabelInputContainer>

        <button
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
          type="submit"
        >
          Login &rarr;
          <BottomGradient />
        </button>

        <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

        <div>
          <Link href={"/register"}>
            <button
              className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
              type="button"
            >
              Register &rarr;
              <BottomGradient />
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
