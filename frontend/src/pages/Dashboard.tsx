import { useEffect, useState } from "react";
import Header from "../components/Header";
import JobCard from "../components/JobCard";

interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  remote: boolean;
}

export default function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [remoteFilter, setRemoteFilter] = useState<"all" | "remote" | "onsite">(
    "all"
  );

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3333/jobs", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        setFilteredJobs(data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let results = jobs;

    if (search.trim() !== "") {
      results = results.filter(
        (job) =>
          job.title.toLowerCase().includes(search.toLowerCase()) ||
          job.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (locationFilter.trim() !== "") {
      results = results.filter((job) =>
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (remoteFilter === "remote") {
      results = results.filter((job) => job.remote);
    } else if (remoteFilter === "onsite") {
      results = results.filter((job) => !job.remote);
    }

    setFilteredJobs(results);
  }, [search, locationFilter, remoteFilter, jobs]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Carregando vagas...
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto mt-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Vagas disponíveis</h1>

        <div className="bg-white p-4 rounded-lg shadow mb-8 grid gap-4 md:grid-cols-3">
          <input
            type="text"
            placeholder="Buscar por título ou descrição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          />

          <input
            type="text"
            placeholder="Filtrar por localização..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          />

          <select
            value={remoteFilter}
            onChange={(e) =>
              setRemoteFilter(e.target.value as "all" | "remote" | "onsite")
            }
            className="border px-3 py-2 rounded w-full"
          >
            <option value="all">Todas</option>
            <option value="remote">Remotas</option>
            <option value="onsite">Presenciais</option>
          </select>
        </div>

        {filteredJobs.length === 0 ? (
          <p className="text-gray-600">Nenhuma vaga encontrada.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} {...job} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
