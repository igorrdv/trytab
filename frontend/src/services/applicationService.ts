export async function applyToJob(jobId: number) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Usuário não autenticado");

  const res = await fetch("http://localhost:3333/applications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ jobId }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Erro ao se candidatar");
  }

  return await res.json();
}
