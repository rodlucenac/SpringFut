"use client";

import { useEffect, useState } from "react";
import { FaStar, FaFutbol, FaTrophy } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function JogadoresAcimaMediaAvaliacaoPage() {
  const [jogadores, setJogadores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetch("http://localhost:8080/api/consultas/jogadores-acima-media-avaliacao")
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
          setJogadores(data);
        } else {
          setJogadores([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar jogadores:", err);
        setError(err.message || "Erro ao carregar jogadores. Verifique se o backend está rodando.");
        setJogadores([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-600">Carregando...</div>
      </div>
    );
  }

  // Dados para gráfico
  const graficoData = jogadores
    .map(j => ({
      nome: j.nome,
      mediaEstrelas: parseFloat(j.mediaEstrelas) || 0
    }))
    .sort((a, b) => b.mediaEstrelas - a.mediaEstrelas)
    .slice(0, 10); // Top 10

  const mediaGeral = jogadores.length > 0
    ? jogadores.reduce((acc, j) => acc + parseFloat(j.mediaEstrelas || 0), 0) / jogadores.length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">
            📊 Consulta 3: Jogadores Acima da Média de Avaliação (Subconsulta)
          </h2>
          <p className="text-yellow-700 text-sm">
            Query usando subconsulta na cláusula HAVING para encontrar jogadores com média de estrelas acima da média geral.
          </p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FaTrophy className="text-yellow-600" />
            Jogadores Acima da Média
          </h1>
          <div className="flex gap-2">
            <a
              href="/dashboard"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
            >
              Dashboard
            </a>
            <a
              href="/ranking"
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition text-sm font-medium"
            >
              Ranking
            </a>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600 mb-1">Total de Jogadores</div>
            <div className="text-2xl font-bold text-gray-900">{jogadores.length}</div>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow p-4 border border-yellow-200">
            <div className="text-sm text-yellow-600 mb-1">Média Geral</div>
            <div className="text-2xl font-bold text-yellow-900">
              {mediaGeral.toFixed(2)} ⭐
            </div>
          </div>
          <div className="bg-green-50 rounded-lg shadow p-4 border border-green-200">
            <div className="text-sm text-green-600 mb-1">Maior Média</div>
            <div className="text-2xl font-bold text-green-900">
              {jogadores.length > 0 
                ? Math.max(...jogadores.map(j => parseFloat(j.mediaEstrelas || 0))).toFixed(2)
                : "0.00"} ⭐
            </div>
          </div>
        </div>

        {/* Gráfico */}
        {graficoData.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Top 10 Jogadores por Média de Estrelas</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={graficoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nome" angle={-45} textAnchor="end" height={100} />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="mediaEstrelas" fill="#F59E0B" name="Média de Estrelas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Tabela */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Jogador</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Média de Estrelas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avaliação</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jogadores
                  .sort((a, b) => parseFloat(b.mediaEstrelas || 0) - parseFloat(a.mediaEstrelas || 0))
                  .map((jogador) => {
                    const media = parseFloat(jogador.mediaEstrelas || 0);
                    const estrelas = Math.round(media);
                    return (
                      <tr key={jogador.idJogador} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {jogador.nome}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {jogador.idJogador}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-semibold text-yellow-600">
                              {media.toFixed(2)}
                            </span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <FaStar
                                  key={i}
                                  className={i < estrelas ? "text-yellow-400" : "text-gray-300"}
                                />
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            media >= 4.5 ? "bg-green-100 text-green-800" :
                            media >= 4.0 ? "bg-blue-100 text-blue-800" :
                            media >= 3.5 ? "bg-yellow-100 text-yellow-800" :
                            "bg-gray-100 text-gray-800"
                          }`}>
                            {media >= 4.5 ? "Excelente" :
                             media >= 4.0 ? "Muito Bom" :
                             media >= 3.5 ? "Bom" : "Regular"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

        {jogadores.length === 0 && !error && (
          <div className="bg-white rounded-lg shadow p-12 text-center mt-6">
            <FaFutbol className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600">Nenhum jogador encontrado acima da média</p>
          </div>
        )}
      </div>
    </div>
  );
}

