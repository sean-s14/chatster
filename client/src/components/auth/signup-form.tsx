import React, { useState, useEffect } from "react";
import { Button } from "@/components/shadcn/ui/button";
import { Input } from "@/components/shadcn/ui/input";
import { Label } from "@/components/shadcn/ui/label";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "@/utils/auth/credential-validation";
import { SignupFormData } from "@/types/form-data";
import { signup } from "@/services/signup";
import { AxiosError } from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/shadcn/use-toast";

const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

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
    const email = validateEmail(formData.email);
    const password = validatePassword(formData.password);
    const password2 = validateConfirmPassword(
      formData.password,
      formData.password2
    );

    setErrors({ ...email.errors, ...password.errors, ...password2.errors });
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = validateEmail(formData.email, true);
    const password = validatePassword(formData.password, true);
    const password2 = validateConfirmPassword(
      formData.password,
      formData.password2,
      true
    );
    const valid = email.valid && password.valid && password2.valid;

    if (!valid) {
      const errors = {
        ...email.errors,
        ...password.errors,
        ...password2.errors,
      };
      setErrors(errors);
      return;
    } else {
      try {
        const response = await signup(formData);
        if (response.status === 201) {
          toast({
            title: "Signup Successful!",
            variant: "success",
          });
          return navigate("/login");
        }
      } catch (error) {
        console.error("Signup failed:", error);
        if (error instanceof AxiosError) {
          if (error.response?.data.errors) {
            setErrors(error.response?.data.errors);
          } else if (error.response?.data.message) {
            toast({
              title: "Signup failed",
              description: error.response?.data.message,
              variant: "destructive",
            });
          }
        }
      }
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
      <div className="mt-4 flex items-center justify-center">
        <span>Already have an account? Log in</span>
        <Link to="/login" className="text-blue-400 underline ml-1">
          here
        </Link>
      </div>
    </form>
  );
};

export default SignupForm;
