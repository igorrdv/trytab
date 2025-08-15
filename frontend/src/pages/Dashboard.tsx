import { useEffect, useState } from "react";
import api from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const jobsRes = await api.get("/api/jobs");
      const appsRes = await api.get("/applications");
      setStats({
        jobsCount: jobsRes.data.length,
        applicationsCount: appsRes.data.length,
      });
    };
    fetchStats();
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Total de vagas: {stats.jobsCount}</p>
      <p>Total de candidaturas: {stats.applicationsCount}</p>
    </div>
  );
}
