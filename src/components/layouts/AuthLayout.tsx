import type { ReactNode } from "react";

type Props = { children: ReactNode };

export default function AuthLayout({ children }: Props) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
