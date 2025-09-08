import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function CreateJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    remote: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/company/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro ao criar vaga");
      }

      navigate("/company/jobs");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded">
        <h1 className="text-2xl font-bold mb-6">Criar nova vaga</h1>

        {error && (
          <p className="bg-red-100 text-red-600 p-2 rounded mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold">Título</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">Descrição</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">Local</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="remote"
              checked={form.remote}
              onChange={handleChange}
            />
            Vaga remota
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Criando..." : "Criar vaga"}
          </button>
        </form>
      </div>
    </>
  );
}
