"use client";

import { useState } from "react";
import { register } from "../services/authService";

export default function RegisterPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setSucesso("");
    if (!nome || !email || !senha || !confirmarSenha) {
      setErro("Preencha todos os campos!");
      return;
    }
    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem!");
      return;
    }
    setLoading(true);
    try {
      await register(nome, email, senha);
      setSucesso(
        "Cadastro realizado com sucesso! Redirecionando para login..."
      );
      setTimeout(() => {
        window.location.href = "/login";
      }, 1800);
    } catch (err: any) {
      setErro(err.message || "Erro ao cadastrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-200 via-green-50 to-white px-4">
      <div className="w-full max-w-md bg-white/90 rounded-3xl shadow-2xl p-10 flex flex-col items-center border border-green-100">
        <h2 className="text-3xl font-extrabold text-green-700 mb-2 tracking-tight">
          Crie sua conta
        </h2>
        <p className="text-gray-500 mb-6 text-center text-base">
          Organize, jogue e acompanhe suas peladas com facilidade!
        </p>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nome completo"
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 text-gray-700"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            autoComplete="name"
            disabled={loading}
          />
          <input
            type="email"
            placeholder="E-mail"
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 text-gray-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            disabled={loading}
          />
          <div className="flex gap-2">
            <input
              type="password"
              placeholder="Senha"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 text-gray-700"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="new-password"
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Confirmar senha"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 text-gray-700"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              autoComplete="new-password"
              disabled={loading}
            />
          </div>
          {erro && (
            <span className="text-red-500 text-sm text-center animate-pulse">
              {erro}
            </span>
          )}
          {sucesso && (
            <span className="text-green-600 text-sm text-center animate-pulse">
              {sucesso}
            </span>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-green-600 to-green-400 text-white font-bold rounded-lg shadow hover:from-green-700 hover:to-green-500 transition text-lg mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
        <a
          href="/login"
          className="mt-6 text-green-700 hover:underline text-sm"
        >
          Já tem conta? Entrar
        </a>
      </div>
    </main>
  );
}
