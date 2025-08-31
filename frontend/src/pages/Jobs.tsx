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
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [remoteOnly, setRemoteOnly] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3333/jobs", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao carregar vagas");
        return res.json();
      })
      .then((data) => setJobs(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Carregando vagas...
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

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.description.toLowerCase().includes(search.toLowerCase());

    const matchesLocation =
      locationFilter === "" ||
      job.location.toLowerCase().includes(locationFilter.toLowerCase());

    const matchesRemote = !remoteOnly || job.remote;

    return matchesSearch && matchesLocation && matchesRemote;
  });

  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto mt-10 p-6">
        <h1 className="text-3xl font-bold mb-6">Vagas disponíveis</h1>

        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Buscar por título ou descrição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-2 border rounded"
          />

          <input
            type="text"
            placeholder="Filtrar por local..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="flex-1 p-2 border rounded"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={remoteOnly}
              onChange={(e) => setRemoteOnly(e.target.checked)}
            />
            Apenas remoto
          </label>
        </div>

        {filteredJobs.length === 0 ? (
          <p className="text-gray-500">Nenhuma vaga encontrada.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <a
                key={job.id}
                href={`/jobs/${job.id}`}
                className="p-6 bg-white rounded shadow hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
                <p className="text-gray-700 mb-2 line-clamp-2">
                  {job.description}
                </p>
                <p className="text-sm text-gray-500">
                  Local: {job.location} {job.remote && "(remote)"}
                </p>
              </a>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
