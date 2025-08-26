import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";

interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  remote: boolean;
}

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:3333/jobs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar vaga");
        return res.json();
      })
      .then((data) => setJob(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Carregando...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p>Vaga não encontrada.</p>
        <button
          onClick={() => navigate("/jobs")}
          className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition"
        >
          Voltar para Vagas
        </button>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded">
        <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
        <p className="text-gray-700 mb-4">{job.description}</p>
        <p className="text-sm text-gray-500 mb-6">
          Local: {job.location} {job.remote && "(remote)"}
        </p>
        <button
          onClick={() => alert("Aplicação enviada! (mock)")}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Candidatar-se
        </button>
      </div>
    </>
  );
}
