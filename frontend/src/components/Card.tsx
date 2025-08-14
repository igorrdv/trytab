import type { ReactNode } from "react";

interface CardProps {
  children: React.ReactNode;
}

const Card = ({ children }: CardProps) => {
  return <div className="border p-4 rounded shadow bg-white">{children}</div>;
};

export default Card;
