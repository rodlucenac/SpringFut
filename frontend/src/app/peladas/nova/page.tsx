"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NovaPeladaPage() {
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [bairro, setBairro] = useState("");
  const [diaSemana, setDiaSemana] = useState("");
  const [horario, setHorario] = useState("");
  const [limite, setLimite] = useState(20);
  const [valor, setValor] = useState(0);
  const [primeiraRodada, setPrimeiraRodada] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setSucesso("");
    if (
      !nome ||
      !endereco ||
      !bairro ||
      !diaSemana ||
      !horario ||
      !limite ||
      !primeiraRodada
    ) {
      setErro("Preencha todos os campos obrigatórios!");
      return;
    }
    setLoading(true);
    try {
      const organizadorId = localStorage.getItem("userId");
      const response = await fetch("http://localhost:8080/api/peladas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          endereco,
          bairro,
          diaSemana,
          horario,
          limiteMensalistas: limite,
          valorTotal: valor,
          organizadorId,
          primeiraRodada,
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.erro || "Erro ao criar pelada");
      }
      setSucesso("Pelada criada com sucesso!");
      setTimeout(() => router.push("/peladas"), 1200);
    } catch (err: any) {
      setErro(err.message || "Erro ao criar pelada");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-200 via-green-50 to-white px-4">
      <div className="w-full max-w-lg bg-white/95 rounded-3xl shadow-2xl p-10 flex flex-col items-center border border-green-200 mt-10 relative animate-fade-in">
        <div className="absolute left-6 top-6 flex gap-2">
          <button
            type="button"
            className="text-green-600 hover:text-green-800 transition text-sm font-semibold flex items-center gap-1"
            onClick={() => router.back()}
            aria-label="Voltar"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Voltar
          </button>
          <button
            type="button"
            className="text-green-700 hover:text-green-900 transition text-sm font-semibold flex items-center gap-1 border border-green-200 rounded px-2 py-1 bg-green-50 ml-2"
            onClick={() => router.push("/peladas/minhas")}
            aria-label="Minhas peladas"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M16 3v4M8 3v4M3 11h18"
              />
            </svg>
            Minhas peladas
          </button>
        </div>
        <h2 className="text-3xl font-extrabold text-green-700 mb-1 tracking-tight">
          Nova pelada
        </h2>
        <p className="text-gray-500 text-sm mb-4">
          Preencha os dados para criar sua pelada
        </p>
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-5 mt-2"
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="nome" className="text-green-700 font-semibold">
              Nome da pelada *
            </label>
            <input
              id="nome"
              type="text"
              placeholder="Ex: Futebol dos Amigos"
              className="px-4 py-3 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="endereco" className="text-green-700 font-semibold">
              Endereço *
            </label>
            <input
              id="endereco"
              type="text"
              placeholder="Rua, número, complemento"
              className="px-4 py-3 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="bairro" className="text-green-700 font-semibold">
              Bairro *
            </label>
            <input
              id="bairro"
              type="text"
              placeholder="Ex: Centro"
              className="px-4 py-3 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="flex flex-col gap-1 md:flex-row md:gap-4">
            <div className="flex flex-col gap-1 md:w-1/2">
              <label
                htmlFor="diaSemana"
                className="text-green-700 font-semibold"
              >
                Dia da semana *
              </label>
              <input
                id="diaSemana"
                type="text"
                placeholder="Ex: Sábado"
                className="px-4 py-3 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition"
                value={diaSemana}
                onChange={(e) => setDiaSemana(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="flex flex-col gap-1 md:w-1/2">
              <label htmlFor="horario" className="text-green-700 font-semibold">
                Horário *
              </label>
              <input
                id="horario"
                type="time"
                className="px-4 py-3 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition"
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="primeiraRodada"
              className="text-green-700 font-semibold"
            >
              Data da primeira rodada *
            </label>
            <input
              id="primeiraRodada"
              type="date"
              className="px-4 py-3 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition"
              value={primeiraRodada}
              onChange={(e) => setPrimeiraRodada(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="flex flex-col gap-1 md:flex-row md:gap-4">
            <div className="flex flex-col gap-1 md:w-1/2">
              <label htmlFor="limite" className="text-green-700 font-semibold">
                Limite de jogadores *
              </label>
              <input
                id="limite"
                type="number"
                placeholder="Máx: 50"
                className="px-4 py-3 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition"
                value={limite}
                onChange={(e) => setLimite(Number(e.target.value))}
                min={2}
                max={50}
                disabled={loading}
              />
            </div>
            <div className="flex flex-col gap-1 md:w-1/2">
              <label htmlFor="valor" className="text-green-700 font-semibold">
                Valor total (R$)
              </label>
              <input
                id="valor"
                type="number"
                placeholder="Ex: 200.00"
                className="px-4 py-3 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition"
                value={valor}
                onChange={(e) => setValor(Number(e.target.value))}
                min={0}
                step={0.01}
                disabled={loading}
              />
            </div>
          </div>
          {erro && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-2 text-sm animate-shake">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                />
              </svg>
              {erro}
            </div>
          )}
          {sucesso && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-2 text-sm animate-fade-in">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {sucesso}
            </div>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-green-600 to-green-400 text-white font-bold rounded-lg shadow hover:from-green-700 hover:to-green-500 transition text-lg mt-2 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>{" "}
                Criando...
              </span>
            ) : (
              "Criar pelada"
            )}
          </button>
        </form>
      </div>
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes shake {
          10%,
          90% {
            transform: translateX(-2px);
          }
          20%,
          80% {
            transform: translateX(4px);
          }
          30%,
          50%,
          70% {
            transform: translateX(-8px);
          }
          40%,
          60% {
            transform: translateX(8px);
          }
        }
        .animate-shake {
          animation: shake 0.4s;
        }
      `}</style>
    </main>
  );
}
