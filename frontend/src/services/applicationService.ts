export async function applyToJob(jobId: number) {
  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:3333/jobs/${jobId}/apply`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Erro ao se candidatar à vaga");
  }

  return await res.json();
}

export async function getMyApplications() {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:3333/applications/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar suas candidaturas");
  }

  return await res.json();
}
