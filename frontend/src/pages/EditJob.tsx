import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditJob() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [remote, setRemote] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:3333/jobs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Erro ao carregar vaga");
        const data = await res.json();

        setTitle(data.title);
        setDescription(data.description);
        setLocation(data.location);
        setRemote(data.remote);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:3333/jobs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          location,
          remote,
        }),
      });

      if (!res.ok) throw new Error("Erro ao atualizar vaga");

      navigate("/manage-jobs");
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar vaga");
    }
  };

  if (loading) return <p className="text-center mt-10">Carregando vaga...</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow p-6 rounded">
      <h2 className="text-2xl font-bold mb-4">Editar vaga</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block mb-1">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Descrição</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Local</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={remote}
            onChange={(e) => setRemote(e.target.checked)}
          />
          Vaga remota
        </label>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Atualizar
        </button>
      </form>
    </div>
  );
}
