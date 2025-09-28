"use client";

import { useState } from "react";

async function login(email: string, senha: string) {
  const response = await fetch("http://localhost:8080/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });
  if (!response.ok) {
    throw new Error("Usuário ou senha inválidos");
  }
  return await response.json();
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setSucesso("");
    if (!email || !senha) {
      setErro("Preencha todos os campos!");
      return;
    }
    setLoading(true);
    try {
      const result = await login(email, senha);
      if (result && result.userId) {
        localStorage.setItem("userId", result.userId.toString());
      }
      setSucesso("Login realizado com sucesso! Redirecionando...");
      setTimeout(() => {
        window.location.href = "/peladas";
      }, 1200);
    } catch (err: any) {
      setErro(err.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-green-50 to-white px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-green-700 mb-6">Entrar</h2>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <input
            type="email"
            placeholder="E-mail"
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Senha"
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoComplete="current-password"
          />
          {erro && <span className="text-red-500 text-sm">{erro}</span>}
          {sucesso && <span className="text-green-500 text-sm">{sucesso}</span>}
          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white font-bold rounded-lg shadow hover:bg-green-700 transition text-lg mt-2"
            disabled={loading}
          >
            {loading ? "Carregando..." : "Entrar"}
          </button>
        </form>
        <a
          href="/register"
          className="mt-6 text-green-700 hover:underline text-sm"
        >
          Não tem conta? Cadastre-se
        </a>
      </div>
    </main>
  );
}
