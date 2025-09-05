import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setName(res.data.name);
        if (res.data.role === "company") {
          setCompanyName(res.data.companyName || "");
        }
      } catch (err) {
        console.error(err);
        setMessage("❌ Erro ao carregar perfil");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      const token = localStorage.getItem("token");
      const payload: any = { name };
      if (password.trim() !== "") payload.password = password;
      if (user.role === "company") payload.companyName = companyName;

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/me`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUser(res.data);
      setMessage("✅ Perfil atualizado com sucesso!");
      setEditing(false);
      setPassword("");
    } catch (err: any) {
      setMessage(
        "❌ " + (err.response?.data?.error || "Erro ao atualizar perfil")
      );
    }
  };

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;

  if (!user) return <p className="text-center mt-10">No user data found.</p>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">My Profile</h2>

      {!editing ? (
        <>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          {user.role === "company" && (
            <p>
              <strong>Company:</strong> {user.companyName}
            </p>
          )}

          <button
            onClick={() => setEditing(true)}
            className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Edit Profile
          </button>
        </>
      ) : (
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          {user.role === "company" && (
            <div>
              <label className="block text-sm font-medium mb-1">Company</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">
              New Password
            </label>
            <input
              type="password"
              placeholder="Leave blank to keep current"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setPassword("");
                setName(user.name);
                if (user.role === "company")
                  setCompanyName(user.companyName || "");
              }}
              className="flex-1 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {message && <p className="mt-4 text-center text-sm">{message}</p>}
    </div>
  );
}
