import { useEffect, useState } from "react";
import Header from "../components/Header";

type Stats = {
  jobsCount: number;
  applicationsCount: number;
  pendingApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
};

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/company/dashboard`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Erro ao carregar estatísticas");

        const data = await res.json();
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading)
    return <p className="text-center mt-10">Carregando dashboard...</p>;

  if (error)
    return <p className="text-center mt-10 text-red-600">Erro: {error}</p>;

  if (!stats)
    return <p className="text-center mt-10">Nenhuma estatística disponível.</p>;

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto mt-10 p-6">
        <h1 className="text-3xl font-bold mb-8">Dashboard da Empresa</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white shadow rounded text-center">
            <h2 className="text-lg font-semibold text-gray-700">
              Vagas Criadas
            </h2>
            <p className="text-3xl font-bold text-blue-600">
              {stats.jobsCount}
            </p>
          </div>

          <div className="p-6 bg-white shadow rounded text-center">
            <h2 className="text-lg font-semibold text-gray-700">
              Total de Candidaturas
            </h2>
            <p className="text-3xl font-bold text-green-600">
              {stats.applicationsCount}
            </p>
          </div>

          <div className="p-6 bg-white shadow rounded text-center">
            <h2 className="text-lg font-semibold text-gray-700">Pendentes</h2>
            <p className="text-3xl font-bold text-yellow-600">
              {stats.pendingApplications}
            </p>
          </div>

          <div className="p-6 bg-white shadow rounded text-center">
            <h2 className="text-lg font-semibold text-gray-700">Aceitas</h2>
            <p className="text-3xl font-bold text-green-700">
              {stats.acceptedApplications}
            </p>
          </div>

          <div className="p-6 bg-white shadow rounded text-center">
            <h2 className="text-lg font-semibold text-gray-700">Recusadas</h2>
            <p className="text-3xl font-bold text-red-600">
              {stats.rejectedApplications}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
