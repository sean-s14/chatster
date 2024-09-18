import React, { useState, useEffect } from "react";
import { Button } from "@/components/shadcn/ui/button";
import { Input } from "@/components/shadcn/ui/input";
import { Label } from "@/components/shadcn/ui/label";
import { signupValidate } from "@/utils/auth/credential-validation";
import { SignupFormData } from "@/types/form-data";
import { signup } from "@/services/signup";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

const SignupForm: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<SignupFormData>({
    email: null,
    password: null,
    password2: null,
  });
  const [errors, setErrors] = useState<SignupFormData>({
    email: "",
    password: "",
    password2: "",
  });

  useEffect(() => {
    const { errors } = signupValidate(formData);
    setErrors(errors);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { valid, errors } = signupValidate(formData, true);
    if (valid) {
      try {
        const response = await signup(formData);
        if (response.status === 201) {
          // TODO: Add toast notification for successful signup
          return navigate("/login");
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.data.errors) {
            setErrors(error.response?.data.errors);
          } else if (error.response?.data.error) {
            // TODO: Change alert to toast
            alert(error.response?.data.error);
          }
        }
        console.error("Signup failed:", error);
      }
      return;
    } else {
      setErrors(errors);
      return;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Signup</h2>
      <div>
        <Label htmlFor="email" className="text-base">
          Email:
        </Label>
        <Input
          type="email"
          id="email"
          name="email"
          value={formData.email || ""}
          onChange={handleChange}
        />
        {errors.email && (
          <span className="text-red-500 text-sm">{errors.email}</span>
        )}
      </div>
      <div>
        <Label htmlFor="password" className="text-base">
          Password:
        </Label>
        <Input
          type="password"
          id="password"
          name="password"
          value={formData.password || ""}
          onChange={handleChange}
        />
        {errors.password && (
          <span className="text-red-500 text-sm">{errors.password}</span>
        )}
      </div>
      <div>
        <Label htmlFor="password2" className="text-base">
          Confirm Password:
        </Label>
        <Input
          type="password"
          id="password2"
          name="password2"
          value={formData.password2 || ""}
          onChange={handleChange}
        />
        {errors.password2 && (
          <span className="text-red-500 text-sm">{errors.password2}</span>
        )}
      </div>
      <div className="flex justify-center mt-4">
        <Button type="submit" className="w-32" variant={"outline"}>
          Submit
        </Button>
      </div>
    </form>
  );
};

export default SignupForm;
