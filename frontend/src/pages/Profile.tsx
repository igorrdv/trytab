import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "company";
  companyName?: string;
  avatarUrl?: string;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;
  if (!user) return <p className="text-center mt-10">No user data found.</p>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg p-6 text-center">
      {user.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt="Profile"
          className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
        />
      ) : (
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500 text-sm">No photo</span>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4">My Profile</h2>

      <p className="mb-2">
        <strong>Name:</strong> {user.name}
      </p>
      <p className="mb-2">
        <strong>Email:</strong> {user.email}
      </p>
      <p className="mb-2">
        <strong>Role:</strong> {user.role}
      </p>
      {user.role === "company" && (
        <p className="mb-2">
          <strong>Company:</strong> {user.companyName}
        </p>
      )}
    </div>
  );
}
