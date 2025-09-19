import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Application {
  id: number;
  status: string;
  createdAt: string;
  job: {
    id: number;
    title: string;
  };
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export default function ApplicationDetails() {
  const { id } = useParams<{ id: string }>();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:3333/applications/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Erro ao carregar candidatura");
        const data = await res.json();
        setApplication(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Carregando...</p>;
  if (error) return <p className="text-center mt-10">Erro: {error}</p>;
  if (!application)
    return <p className="text-center mt-10">Candidatura não encontrada.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow rounded p-6">
      <h2 className="text-2xl font-bold mb-4">Detalhes da Candidatura</h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Vaga</h3>
        <p>
          <strong>Título:</strong> {application.job.title}
        </p>
        <p>
          <strong>ID:</strong> {application.job.id}
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Candidato</h3>
        <p>
          <strong>Nome:</strong> {application.user.name}
        </p>
        <p>
          <strong>Email:</strong> {application.user.email}
        </p>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Status da candidatura</h3>
        <p>
          <strong>Status:</strong> {application.status}
        </p>
        <p>
          <strong>Enviada em:</strong>{" "}
          {new Date(application.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
