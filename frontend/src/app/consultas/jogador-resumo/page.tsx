"use client";

import { useEffect, useState } from "react";
import { FaUser, FaFutbol, FaDollarSign, FaStar } from "react-icons/fa";
import { BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function JogadorResumoPage() {
  const [resumos, setResumos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [filtroJogador, setFiltroJogador] = useState("");

  useEffect(() => {
    const url = filtroJogador 
      ? `http://localhost:8080/api/consultas/views/jogador-resumo?idJogador=${filtroJogador}`
      : "http://localhost:8080/api/consultas/views/jogador-resumo";
    
    fetch(url)
      .then(async res => {
        const data = await res.json();
        
        if (!res.ok) {
          const errorMessage = data?.erro || data?.message || `Erro ${res.status}: ${res.statusText}`;
          throw new Error(errorMessage);
        }
        
        return data;
      })
      .then(data => {
        // Garantir que data é sempre um array
        if (Array.isArray(data)) {
          setResumos(data);
        } else if (data && typeof data === 'object' && data.erro) {
          setError(data.erro || "Erro desconhecido");
          setResumos([]);
        } else {
          console.warn("Resposta inesperada da API:", data);
          setResumos([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar resumos:", err);
        setError(err.message || "Erro ao carregar resumos. Verifique se o backend está rodando.");
        setResumos([]);
        setLoading(false);
      });
  }, [filtroJogador]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto text-center py-12">
          <div className="text-gray-600">Carregando resumos...</div>
        </div>
      </div>
    );
  }

  // Garantir que resumos é sempre um array
  const resumosArray = Array.isArray(resumos) ? resumos : [];

  // Dados para gráfico de desempenho
  const desempenhoData = resumosArray.slice(0, 10).map(r => ({
    nome: r.nome,
    gols: r.totalGols || 0,
    assistencias: r.totalAssistencias || 0,
    estrelas: parseFloat(r.mediaEstrelas || 0).toFixed(1)
  }));

  // Dados para gráfico financeiro
  const financeiroData = resumosArray.slice(0, 10).map(r => ({
    nome: r.nome,
    pago: parseFloat(r.totalPago || 0),
    pendente: parseFloat(r.totalPendente || 0),
    atrasado: parseFloat(r.totalAtrasado || 0)
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-cyan-800 mb-2">
            📊 View: vw_jogador_resumo_financeiro
          </h2>
          <p className="text-cyan-700 text-sm">
            Esta view consolida informações financeiras e esportivas por jogador, incluindo participação, pagamentos e desempenho.
          </p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FaUser className="text-cyan-600" />
            Resumo Financeiro dos Jogadores
          </h1>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Filtrar por ID do Jogador"
              value={filtroJogador}
              onChange={(e) => setFiltroJogador(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
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
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6 text-center">
            <div className="text-red-800 font-semibold mb-2">Erro</div>
            <div className="text-red-600">{error}</div>
          </div>
        )}

        {!error && resumosArray.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 mb-6 text-center">
            <div className="text-gray-600 text-lg mb-2">Nenhum jogador encontrado</div>
            <div className="text-gray-500 text-sm">
              {filtroJogador ? "Nenhum jogador encontrado com o ID informado." : "Não há jogadores cadastrados no momento."}
            </div>
          </div>
        )}

        {!error && resumosArray.length > 0 && (
          <>
            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Top 10 - Desempenho</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={desempenhoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nome" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="gols" fill="#10B981" name="Gols" />
                <Bar dataKey="assistencias" fill="#3B82F6" name="Assistências" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Top 10 - Situação Financeira</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={financeiroData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nome" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pago" stackId="a" fill="#10B981" name="Pago" />
                <Bar dataKey="pendente" stackId="a" fill="#F59E0B" name="Pendente" />
                <Bar dataKey="atrasado" stackId="a" fill="#EF4444" name="Atrasado" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jogador</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Peladas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rodadas Cobradas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Pago</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pendente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Atrasado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Média Estrelas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gols</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assistências</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {resumosArray.map((resumo) => (
                  <tr key={resumo.idJogador} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaUser className="text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900">{resumo.nome}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {resumo.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaFutbol className="text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{resumo.peladasParticipadas || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {resumo.rodadasCobradas || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaDollarSign className="text-green-500 mr-1" />
                        <span className="text-sm font-medium text-green-600">
                          R$ {parseFloat(resumo.totalPago || 0).toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">
                      R$ {parseFloat(resumo.totalPendente || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      R$ {parseFloat(resumo.totalAtrasado || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaStar className="text-yellow-400 mr-1" />
                        <span className="text-sm font-medium text-gray-900">
                          {parseFloat(resumo.mediaEstrelas || 0).toFixed(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {resumo.totalGols || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {resumo.totalAssistencias || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
}

