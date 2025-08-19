import { useEffect, useState } from "react";
import Header from "../components/Header";

interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  remote: boolean;
}

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3333/jobs", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar jobs");
        return res.json();
      })
      .then((data) => setJobs(data))
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

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded">
        <h1 className="text-2xl font-bold mb-6">Vagas disponíveis</h1>
        {jobs.length === 0 ? (
          <p>Nenhuma vaga encontrada.</p>
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
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
