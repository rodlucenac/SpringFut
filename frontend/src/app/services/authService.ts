export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string; // se o backend retornar um JWT, por exemplo
  userId: number;
  nome: string;
}

const API_URL = "http://localhost:8080/api";

export async function register(
  nome: string,
  email: string,
  senha: string
): Promise<{ mensagem: string }> {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, senha }),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.erro || "Erro ao cadastrar");
  }
  return await response.json();
}

export async function login(
  email: string,
  senha: string
): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.erro || "Erro ao fazer login");
  }

  return await response.json();
}
