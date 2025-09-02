import { Link } from "react-router-dom";

interface JobCardProps {
  id: number;
  title: string;
  description: string;
  location: string;
  remote: boolean;
}

export default function JobCard({
  id,
  title,
  description,
  location,
  remote,
}: JobCardProps) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">{description}</p>
        <p className="text-gray-500 text-sm">
          📍 {location} {remote && "(Remoto)"}
        </p>
      </div>

      <div className="mt-4 flex justify-end">
        <Link
          to={`/jobs/${id}`}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Ver detalhes
        </Link>
      </div>
    </div>
  );
}
