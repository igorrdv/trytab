import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  companyName?: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3333/api/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Carregando...
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <Header />
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded">
        <h1 className="text-2xl font-bold mb-4">Bem-vindo, {user.name}!</h1>
        <p>Email: {user.email}</p>
        <p>Função: {user.role}</p>
        {user.companyName && <p>Empresa: {user.companyName}</p>}
      </div>
    </>
  );
}
