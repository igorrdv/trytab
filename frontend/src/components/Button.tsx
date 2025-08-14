import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
}

const Button = ({ children, onClick, type = "button" }: ButtonProps) => (
  <button
    type={type}
    onClick={onClick}
    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
  >
    {children}
  </button>
);

export default Button;
