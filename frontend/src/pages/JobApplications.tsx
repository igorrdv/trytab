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
};

export default function JobApplications() {
  const { id } = useParams<{ id: string }>();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    fetchApplications();
  }, [id]);

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
                </div>

                <div className="flex gap-2">
                  <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                    Aceitar
                  </button>
                  <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                    Recusar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
