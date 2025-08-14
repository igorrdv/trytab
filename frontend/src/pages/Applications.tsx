import { useEffect, useState } from "react";
import api from "../services/api";

export default function Applications() {
  const [apps, setApps] = useState<any[]>([]);

  useEffect(() => {
    const fetchApplications = async () => {
      const res = await api.get("/applications");
      setApps(res.data);
    };
    fetchApplications();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Candidaturas</h1>
      <ul className="space-y-2">
        {apps.map((app) => (
          <li key={app.id} className="border p-3 rounded">
            <p>
              <strong>Job ID:</strong> {app.jobId}
            </p>
            <p>
              <strong>Usuário:</strong> {app.userId}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
