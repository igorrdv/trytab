import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";

type Application = {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  createdAt: string;
  status: "pending" | "accepted" | "rejected";
};

export default function JobApplications() {
  const { id } = useParams<{ id: string }>();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/company/jobs/${id}/applications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Erro ao carregar candidaturas");

      const data = await res.json();
      setApplications(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [id]);

  const handleDecision = async (
    appId: number,
    decision: "accepted" | "rejected"
  ) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/company/applications/${appId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: decision }),
        }
      );

      if (!res.ok) throw new Error("Erro ao atualizar candidatura");

      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: decision } : a))
      );
    } catch (err: any) {
      alert("❌ " + err.message);
    }
  };

  if (loading)
    return <p className="text-center mt-10">Carregando candidaturas...</p>;

  if (error)
    return <p className="text-center mt-10 text-red-600">Erro: {error}</p>;

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Candidaturas da vaga #{id}</h1>
          <Link
            to="/company/jobs"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            Voltar
          </Link>
        </div>

        {applications.length === 0 ? (
          <p>Nenhuma candidatura recebida ainda.</p>
        ) : (
          <ul className="space-y-4">
            {applications.map((app) => (
              <li
                key={app.id}
                className="p-4 border rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{app.user.name}</p>
                  <p className="text-sm text-gray-600">{app.user.email}</p>
                  <p className="text-xs text-gray-400">
                    Inscrito em {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                  <p className="mt-1 text-sm">
                    <strong>Status:</strong>{" "}
                    {app.status === "pending" && (
                      <span className="text-yellow-600">Pendente</span>
                    )}
                    {app.status === "accepted" && (
                      <span className="text-green-600">Aceita</span>
                    )}
                    {app.status === "rejected" && (
                      <span className="text-red-600">Recusada</span>
                    )}
                  </p>
                </div>

                {app.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDecision(app.id, "accepted")}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Aceitar
                    </button>
                    <button
                      onClick={() => handleDecision(app.id, "rejected")}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Recusar
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
