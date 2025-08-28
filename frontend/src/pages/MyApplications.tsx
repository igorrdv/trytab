import { useEffect, useState } from "react";
import Header from "../components/Header";
import { getMyApplications } from "../services/applicationService";

interface Application {
  id: number;
  job: {
    id: number;
    title: string;
    location: string;
    remote: boolean;
  };
  appliedAt: string;
}

export default function MyApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyApplications()
      .then((data) => setApplications(data))
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
        <h1 className="text-2xl font-bold mb-6">Minhas candidaturas</h1>
        {applications.length === 0 ? (
          <p>Você ainda não se candidatou a nenhuma vaga.</p>
        ) : (
          <ul className="space-y-4">
            {applications.map((app) => (
              <li
                key={app.id}
                className="p-4 border rounded shadow-sm hover:shadow-md transition"
              >
                <h2 className="text-xl font-semibold">{app.job.title}</h2>
                <p className="text-sm text-gray-500">
                  Local: {app.job.location} {app.job.remote && "(remote)"}
                </p>
                <p className="text-gray-600 mt-1">
                  Candidatado em:{" "}
                  {new Date(app.appliedAt).toLocaleDateString("pt-BR")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
