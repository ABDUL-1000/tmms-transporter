"use client"
import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, RegisterData } from "@/lib/validation"

import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

import { signup } from "@/lib/API/signup"

export default function SignupFormDemo() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = async (data: RegisterData) => {
  try {
    const response = await signup({
      ...data,
      address: "test address",
      city: "test city",
      state: "test state",
      country: "test country",
      description: "test description"
    });

    const { token } = response;

    if (token) {
      sessionStorage.setItem("token", token);
      toast.success("Registration successful!");
      router.push("/login");
    }
  } catch (error: any) {
    console.error(error);
    toast.error(error.message || "Registration failed");
  }
};

  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Transporter Registration
      </h2>
      <form className="my-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <LabelInputContainer>
          <Label>First Name</Label>
          <Input {...register("name")} placeholder="Tyler" />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </LabelInputContainer>

        <LabelInputContainer>
          <Label>Email</Label>
          <Input {...register("email")} placeholder="you@example.com" type="email" />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </LabelInputContainer>

        <LabelInputContainer>
          <Label>Phone Number</Label>
          <Input {...register("phone_number")} placeholder="080..." />
          {errors.phone_number && <p className="text-red-500 text-sm">{errors.phone_number.message}</p>}
        </LabelInputContainer>

        <LabelInputContainer>
          <Label>License Number</Label>
          <Input {...register("license_number")} placeholder="12345" />
          {errors.license_number && <p className="text-red-500 text-sm">{errors.license_number.message}</p>}
        </LabelInputContainer>

        <LabelInputContainer>
          <Label>License Details</Label>
          <Input {...register("license_details")} placeholder="Details..." />
          {errors.license_details && <p className="text-red-500 text-sm">{errors.license_details.message}</p>}
        </LabelInputContainer>

        <LabelInputContainer>
          <Label>Password</Label>
          <Input {...register("password")} placeholder="••••••••" type="password" />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </LabelInputContainer>

        <LabelInputContainer>
          <Label>Confirm Password</Label>
          <Input {...register("password_confirmation")} placeholder="••••••••" type="password" />
          {errors.password_confirmation && <p className="text-red-500 text-sm">{errors.password_confirmation.message}</p>}
        </LabelInputContainer>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-black text-white py-2"
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  )
}

const LabelInputContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      {children}
    </div>
  )
}
