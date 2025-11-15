"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaUser, FaSignOutAlt } from "react-icons/fa";

export default function PerfilPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [resumo, setResumo] = useState<{
    classificacao: string;
    totalInscricoes: number;
    confirmados: number;
    percentualConfirmado: number;
  } | null>(null);
  const [resumoErro, setResumoErro] = useState("");
  const [resumoLoading, setResumoLoading] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      router.push("/login");
      return;
    }
    setUserId(storedUserId);
  }, [router]);

  useEffect(() => {
    if (!userId) return;
    setResumoLoading(true);
    fetch(`http://localhost:8080/api/pessoas/jogador/${userId}/classificacao`)
      .then((res) => {
        if (!res.ok) throw new Error("Falha ao carregar assiduidade");
        return res.json();
      })
      .then((data) => {
        setResumo({
          classificacao: data.classificacao,
          totalInscricoes: data.totalInscricoes,
          confirmados: data.confirmados,
          percentualConfirmado: data.percentualConfirmado,
        });
        setResumoErro("");
      })
      .catch((err) => {
        setResumo(null);
        setResumoErro(err.message);
      })
      .finally(() => setResumoLoading(false));
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Carregando...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Meu Perfil</h1>
          <button
            onClick={() => router.push("/peladas")}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            ← Voltar
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
          {/* Card: Dados Pessoais */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow w-full max-w-sm">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
              <FaUser className="text-purple-600 text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Dados Pessoais
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Edite suas informações pessoais
            </p>
            <button
              onClick={() => router.push("/perfil/editar")}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Editar Perfil
            </button>
          </div>

          {/* Card: Assiduidade */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow w-full max-w-sm">
            <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide mb-1">
              Assiduidade
            </p>
            {resumoLoading ? (
              <p className="text-gray-500 text-sm">Carregando...</p>
            ) : resumoErro ? (
              <p className="text-red-600 text-sm">{resumoErro}</p>
            ) : resumo ? (
              <>
                <p className="text-2xl font-bold text-green-700">
                  {resumo.classificacao}
                </p>
                <p className="text-sm text-gray-500 mb-3">
                  {resumo.percentualConfirmado.toFixed(1)}% das inscrições
                  confirmadas
                </p>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>Total de inscrições: {resumo.totalInscricoes}</p>
                  <p>Confirmadas: {resumo.confirmados}</p>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">
                Sem histórico suficiente para calcular.
              </p>
            )}
          </div>
        </div>

        {/* Logout */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            <FaSignOutAlt />
            Sair
          </button>
        </div>
      </div>
    </main>
  );
}
