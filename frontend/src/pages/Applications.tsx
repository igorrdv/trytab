import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Application {
  id: number;
  jobTitle: string;
  status: string;
  createdAt: string;
}

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:3333/applications", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar candidaturas");
        return res.json();
      })
      .then((data) => {
        setApplications(data);
      })
      .catch((err) => {
        console.error(err);
        localStorage.removeItem("token");
        navigate("/login");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Carregando...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6">Minhas Candidaturas</h1>
      {applications.length === 0 ? (
        <p>Você ainda não se candidatou a nenhuma vaga.</p>
      ) : (
        <ul className="space-y-4">
          {applications.map((app) => (
            <li
              key={app.id}
              className="p-4 border rounded shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold">{app.jobTitle}</h2>
              <p className="text-sm text-gray-600">Status: {app.status}</p>
              <p className="text-xs text-gray-500">
                Candidatado em:{" "}
                {new Date(app.createdAt).toLocaleDateString("pt-BR")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
