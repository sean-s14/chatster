import React, { useState, useEffect } from "react";
import { Button } from "@/components/shadcn/ui/button";
import { Input } from "@/components/shadcn/ui/input";
import { Label } from "@/components/shadcn/ui/label";
import { loginValidate } from "@/utils/auth/credential-validation";
import { LoginFormData } from "@/types/form-data";
import { useAuth } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState<LoginFormData>({
    email: null,
    password: null,
  });
  const [errors, setErrors] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  useEffect(() => {
    const { errors } = loginValidate(formData);
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
    const { valid, errors } = loginValidate(formData, true);
    if (valid) {
      try {
        const response = await login(formData.email!, formData.password!);
        if (response.status === 200) {
          // TODO: Add toast to signify successful login
          return navigate("/");
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
        console.error("Login failed:", error);
      }
      return;
    } else {
      setErrors(errors);
      return;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email:</Label>
        <Input
          type="email"
          id="email"
          name="email"
          value={formData.email || ""}
          onChange={handleChange}
        />
        {errors.email && <span className="text-red-500">{errors.email}</span>}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password:</Label>
        <Input
          type="password"
          id="password"
          name="password"
          value={formData.password || ""}
          onChange={handleChange}
        />
        {errors.password && (
          <span className="text-red-500">{errors.password}</span>
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

export default LoginForm;
