import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "company";
  companyName?: string;
}

export default function EditProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data: User = res.data;
        setUser(data);

        setForm({
          name: data.name || "",
          email: data.email || "",
          password: "",
          companyName: data.companyName || "",
        });
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      // só envia password se preenchido
      const payload = {
        name: form.name,
        email: form.email,
        ...(form.password ? { password: form.password } : {}),
        ...(user.role === "company" ? { companyName: form.companyName } : {}),
      };

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/${user.id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/profile");
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Password (optional)</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {user?.role === "company" && (
          <div>
            <label className="block font-medium">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className={`w-full p-2 rounded text-white ${
            saving
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
