import {type  ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import {ToastProvider} from "../components/Common/ToastProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>{children}</ToastProvider>
    </AuthProvider>
  );
}
