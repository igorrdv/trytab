import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

type Job = {
  id: number;
  title: string;
  description: string;
  location: string;
  remote: boolean;
};

export default function CompanyJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/company/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao carregar vagas");
      const data = await res.json();
      setJobs(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta vaga?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/company/jobs/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Erro ao excluir vaga");

      setJobs((prev) => prev.filter((job) => job.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <p className="text-center mt-10">Carregando vagas...</p>;

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Minhas vagas</h1>
          <Link
            to="/company/jobs/new"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Nova vaga
          </Link>
        </div>

        {error && (
          <p className="bg-red-100 text-red-600 p-2 rounded mb-4">{error}</p>
        )}

        {jobs.length === 0 ? (
          <p>Nenhuma vaga cadastrada.</p>
        ) : (
          <ul className="space-y-4">
            {jobs.map((job) => (
              <li
                key={job.id}
                className="p-4 border rounded flex justify-between items-center"
              >
                <div>
                  <h2 className="text-lg font-semibold">{job.title}</h2>
                  <p className="text-sm text-gray-600">{job.location}</p>
                  {job.remote && (
                    <span className="text-xs text-blue-600 font-medium">
                      Remoto
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/company/jobs/${job.id}/edit`}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Excluir
                  </button>
                  <Link
                    to={`/company/jobs/${job.id}/applications`}
                    className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                  >
                    Ver candidaturas
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
