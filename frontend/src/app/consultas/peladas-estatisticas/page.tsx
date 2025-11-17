"use client";

import { useEffect, useState } from "react";
import { FaFutbol, FaUsers, FaDollarSign } from "react-icons/fa";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6'];

export default function PeladasEstatisticasPage() {
  const [peladas, setPeladas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/consultas/peladas-estatisticas")
      .then(res => res.json())
      .then(data => {
        setPeladas(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Carregando...</div>;

  // Dados para gráfico de participação
  const participacaoData = peladas.map(p => ({
    nome: `${p.diaSemana} - ${p.horario}`,
    mensalistas: p.mensalistas || 0,
    diaristas: p.diaristas || 0,
    total: p.totalJogadores || 0
  }));

  // Dados para gráfico de arrecadação
  const arrecadacaoData = peladas
    .filter(p => p.totalArrecadado > 0)
    .map(p => ({
      nome: p.diaSemana,
      valor: parseFloat(p.totalArrecadado) || 0
    }))
    .sort((a, b) => b.valor - a.valor);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-green-800 mb-2">
            📊 Consulta 2: Peladas com Estatísticas Completas
          </h2>
          <p className="text-green-700 text-sm">
            Query complexa com múltiplos JOINs, agregações (COUNT, SUM), GROUP BY e CASE para calcular estatísticas por pelada.
          </p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FaFutbol className="text-green-600" />
            Estatísticas das Peladas
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

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Participação por Tipo</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={participacaoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nome" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="mensalistas" fill="#10B981" name="Mensalistas" />
                <Bar dataKey="diaristas" fill="#F59E0B" name="Diaristas" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Arrecadação por Pelada</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={arrecadacaoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nome" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="valor" fill="#3B82F6" name="Arrecadado (R$)" />
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pelada</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Endereço</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jogadores</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mensalistas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diaristas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rodadas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Arrecadado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Organizador</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {peladas.map((pelada) => (
                  <tr key={pelada.idPelada} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{pelada.diaSemana}</div>
                      <div className="text-sm text-gray-500">{pelada.horario}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pelada.endereco ? `${pelada.endereco}, ${pelada.bairro}` : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaUsers className="text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">{pelada.totalJogadores || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pelada.mensalistas || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pelada.diaristas || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pelada.totalRodadas || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaDollarSign className="text-green-500 mr-1" />
                        <span className="text-sm font-medium text-green-600">
                          R$ {parseFloat(pelada.totalArrecadado || 0).toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pelada.organizador || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

