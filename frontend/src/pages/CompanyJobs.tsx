import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  remote: boolean;
}

export default function CompanyJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/company/jobs`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Erro ao carregar vagas da empresa");

        const data = await res.json();
        setJobs(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Carregando vagas da empresa...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        Erro: {error}
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow rounded">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Minhas Vagas</h1>
          <Link
            to="/company/jobs/new"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Criar nova vaga
          </Link>
        </div>

        {jobs.length === 0 ? (
          <p className="text-gray-500">Você ainda não criou nenhuma vaga.</p>
        ) : (
          <ul className="space-y-4">
            {jobs.map((job) => (
              <li
                key={job.id}
                className="p-4 border rounded shadow-sm hover:shadow-md transition"
              >
                <h2 className="text-xl font-semibold">{job.title}</h2>
                <p className="text-gray-700">{job.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Local: {job.location} {job.remote && "(remote)"}
                </p>
                <div className="mt-3 flex gap-2">
                  <Link
                    to={`/jobs/${job.id}`}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Ver
                  </Link>
                  <Link
                    to={`/company/jobs/${job.id}/edit`}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Editar
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
