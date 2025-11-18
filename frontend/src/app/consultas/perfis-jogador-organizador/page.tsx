"use client";

import { useEffect, useState } from "react";
import { FaUser, FaFutbol, FaUserTie, FaUsers } from "react-icons/fa";

export default function PerfisJogadorOrganizadorPage() {
  const [perfis, setPerfis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetch("http://localhost:8080/api/consultas/perfis-jogador-organizador")
      .then(async res => {
        const data = await res.json();
        
        if (!res.ok) {
          const errorMessage = data?.erro || data?.message || `Erro ${res.status}: ${res.statusText}`;
          throw new Error(errorMessage);
        }
        
        return data;
      })
      .then(data => {
        if (Array.isArray(data)) {
          setPerfis(data);
        } else {
          setPerfis([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar perfis:", err);
        setError(err.message || "Erro ao carregar perfis. Verifique se o backend está rodando.");
        setPerfis([]);
        setLoading(false);
      });
  }, []);

  const getPapelColor = (papel: string) => {
    if (papel === "Jogador e Organizador") return "bg-purple-100 text-purple-800";
    if (papel === "Apenas Jogador") return "bg-blue-100 text-blue-800";
    return "bg-green-100 text-green-800";
  };

  const getPapelIcon = (papel: string) => {
    if (papel === "Jogador e Organizador") return <FaUsers className="text-purple-600" />;
    if (papel === "Apenas Jogador") return <FaFutbol className="text-blue-600" />;
    return <FaUserTie className="text-green-600" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-600">Carregando...</div>
      </div>
    );
  }

  const estatisticas = {
    total: perfis.length,
    jogadorEOrganizador: perfis.filter(p => p.papel === "Jogador e Organizador").length,
    apenasJogador: perfis.filter(p => p.papel === "Apenas Jogador").length,
    apenasOrganizador: perfis.filter(p => p.papel === "Apenas Organizador").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-indigo-800 mb-2">
            📊 Consulta 2: Perfis de Jogador e Organizador (Full Outer Join Emulado)
          </h2>
          <p className="text-indigo-700 text-sm">
            Query usando UNION ALL para emular FULL OUTER JOIN, mostrando todos os perfis (jogadores, organizadores e ambos).
          </p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FaUser className="text-indigo-600" />
            Perfis de Jogador e Organizador
          </h1>
          <div className="flex gap-2">
            <a
              href="/dashboard"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
            >
              Dashboard
            </a>
            <a
              href="/pessoas"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
            >
              Pessoas
            </a>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600 mb-1">Total</div>
            <div className="text-2xl font-bold text-gray-900">{estatisticas.total}</div>
          </div>
          <div className="bg-purple-50 rounded-lg shadow p-4 border border-purple-200">
            <div className="text-sm text-purple-600 mb-1">Jogador e Organizador</div>
            <div className="text-2xl font-bold text-purple-900">{estatisticas.jogadorEOrganizador}</div>
          </div>
          <div className="bg-blue-50 rounded-lg shadow p-4 border border-blue-200">
            <div className="text-sm text-blue-600 mb-1">Apenas Jogador</div>
            <div className="text-2xl font-bold text-blue-900">{estatisticas.apenasJogador}</div>
          </div>
          <div className="bg-green-50 rounded-lg shadow p-4 border border-green-200">
            <div className="text-sm text-green-600 mb-1">Apenas Organizador</div>
            <div className="text-2xl font-bold text-green-900">{estatisticas.apenasOrganizador}</div>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Pessoa</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Jogador</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Organizador</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Papel</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {perfis.map((perfil, index) => (
                  <tr key={`${perfil.idPessoa}-${index}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {perfil.idPessoa}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {perfil.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {perfil.idJogador || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {perfil.idOrganizador || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 w-fit ${getPapelColor(perfil.papel)}`}>
                        {getPapelIcon(perfil.papel)}
                        {perfil.papel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {perfis.length === 0 && !error && (
          <div className="bg-white rounded-lg shadow p-12 text-center mt-6">
            <FaUser className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600">Nenhum perfil encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}

