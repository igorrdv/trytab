import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  remote: boolean;
}

export default function ManageJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3333/my-jobs", {
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

    fetchJobs();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta vaga?")) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:3333/jobs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Erro ao excluir vaga");

      setJobs((prev) => prev.filter((job) => job.id !== id));
    } catch (err) {
      alert("Erro ao excluir vaga");
      console.error(err);
    }
  };

  if (loading) return <p className="text-center mt-10">Carregando...</p>;
  if (error) return <p className="text-center mt-10">Erro: {error}</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-6">Minhas vagas</h2>

      {jobs.length === 0 ? (
        <p className="text-gray-500">Nenhuma vaga cadastrada.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="p-6 bg-white shadow rounded flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                <p className="text-gray-600 mb-2">{job.description}</p>
                <p className="text-sm text-gray-500">
                  {job.location} {job.remote && "(remote)"}
                </p>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <Link
                  to={`/edit-job/${job.id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(job.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
