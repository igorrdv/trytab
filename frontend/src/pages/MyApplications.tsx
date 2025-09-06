import { useEffect, useState } from "react";
import Header from "../components/Header";

interface Application {
  id: number;
  job: {
    id: number;
    title: string;
    location: string;
    remote: boolean;
  };
  status: string;
  createdAt: string;
}

export default function MyApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/applications`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Erro ao buscar candidaturas");
        const data = await res.json();
        setApplications(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Carregando candidaturas...
      </div>
    );
  }

  if (error) {
    return <p className="text-center mt-10 text-red-600">{error}</p>;
  }

  return (
    <>
      <Header />
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
                <h2 className="text-xl font-semibold">{app.job.title}</h2>
                <p className="text-sm text-gray-500">
                  Local: {app.job.location} {app.job.remote && "(remote)"}
                </p>
                <p className="mt-2">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`${
                      app.status === "pending"
                        ? "text-yellow-600"
                        : app.status === "accepted"
                        ? "text-green-600"
                        : "text-red-600"
                    } font-medium`}
                  >
                    {app.status}
                  </span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Candidatado em: {new Date(app.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
