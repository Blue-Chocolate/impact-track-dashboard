import React from "react";
import { LoginForm } from "../components/LoginForm";

export const LoginPage: React.FC = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <LoginForm />
    </div>
  );
};
