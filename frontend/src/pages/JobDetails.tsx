import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { applyToJob } from "../services/applicationService";

interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  remote: boolean;
}

export default function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:3333/jobs/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar vaga");
        return res.json();
      })
      .then((data) => setJob(data))
      .catch((err) => setMessage(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleApply() {
    if (!job) return;
    setApplying(true);
    setMessage(null);

    try {
      await applyToJob(job.id);
      setMessage("✅ Candidatura realizada com sucesso!");
    } catch (err: any) {
      setMessage("❌ " + (err.response?.data?.error || err.message));
    } finally {
      setApplying(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Carregando...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex justify-center items-center h-screen">
        Vaga não encontrada.
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded">
        <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
        <p className="text-gray-700 mb-4">{job.description}</p>
        <p className="text-sm text-gray-500 mb-4">
          Local: {job.location} {job.remote && "(remote)"}
        </p>

        <button
          onClick={handleApply}
          disabled={applying}
          className={`px-6 py-2 text-white rounded transition ${
            applying
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {applying ? "Candidatando..." : "Candidatar-se"}
        </button>

        {message && <p className="mt-4 text-center text-sm">{message}</p>}
      </div>
    </>
  );
}
