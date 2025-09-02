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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3333/jobs", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .finally(() => setLoading(false));
  }, []);

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
      <div className="max-w-5xl mx-auto mt-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Vagas disponíveis</h1>
        {jobs.length === 0 ? (
          <p className="text-gray-600">Nenhuma vaga encontrada.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.id} {...job} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
