"use client";

import { useEffect, useState } from "react";
import { FaTrophy, FaMedal } from "react-icons/fa";

interface Jogador {
  nome: string;
  posicao: string;
  peladas: number;
  inscricoes: number;
  presencas: number;
  gols: number;
  assistencias: number;
  estrelas: number;
  percentualPresenca: number;
}

export default function RankingPage() {
  const [ranking, setRanking] = useState<Jogador[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/consultas/ranking-jogadores")
      .then(res => res.json())
      .then(data => {
        setRanking(data);
        setLoading(false);
      });
  }, []);

  const getMedalColor = (posicao: number) => {
    if (posicao === 0) return "text-yellow-500";
    if (posicao === 1) return "text-gray-400";
    if (posicao === 2) return "text-orange-600";
    return "text-gray-300";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-indigo-800 mb-2">
            📊 Consulta 3: Ranking de Jogadores por Desempenho
          </h2>
          <p className="text-indigo-700 text-sm">
            Query complexa com múltiplos JOINs, agregações (COUNT, SUM, AVG), 
            GROUP BY, HAVING e CASE para calcular percentuais. Ordena por 
            gols, assistências e presença.
          </p>
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FaTrophy className="text-yellow-500" />
            Ranking de Jogadores
          </h1>
          <div className="flex gap-2">
            <a
              href="/dashboard"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
            >
              Dashboard
            </a>
            <a
              href="/peladas"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
            >
              Peladas
            </a>
          </div>
        </div>
        
        {loading ? (
          <div>Carregando ranking...</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                    Posição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                    Jogador
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase">
                    Gols
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase">
                    Assistências
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase">
                    Estrelas
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase">
                    Presença
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {ranking.map((jogador, index) => (
                  <tr 
                    key={index}
                    className={index < 3 ? "bg-yellow-50" : "hover:bg-gray-50"}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {index < 3 ? (
                          <FaMedal className={`text-2xl ${getMedalColor(index)}`} />
                        ) : (
                          <span className="text-gray-500 font-semibold">
                            {index + 1}º
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {jogador.nome}
                      </div>
                      <div className="text-sm text-gray-500">
                        {jogador.posicao || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-lg font-bold text-green-600">
                        {jogador.gols}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-lg font-bold text-blue-600">
                        {jogador.assistencias}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="font-semibold">
                          {jogador.estrelas.toFixed(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-sm">
                        <div className="font-semibold">
                          {jogador.percentualPresenca.toFixed(0)}%
                        </div>
                        <div className="text-xs text-gray-500">
                          {jogador.presencas}/{jogador.inscricoes}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

