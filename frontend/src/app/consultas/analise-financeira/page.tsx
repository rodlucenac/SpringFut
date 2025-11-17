"use client";

import { useEffect, useState } from "react";
import { FaChartLine, FaDollarSign, FaCalendarAlt } from "react-icons/fa";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

export default function AnaliseFinanceiraPage() {
  const [dados, setDados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/consultas/analise-financeira")
      .then(res => res.json())
      .then(data => {
        setDados(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Carregando...</div>;

  // Preparar dados para gráficos
  const graficoStatus = dados.map(d => ({
    diaSemana: d.diaSemana,
    recebido: parseFloat(d.valor_recebido || 0),
    pendente: parseFloat(d.valor_pendente || 0),
    atrasado: parseFloat(d.valor_atrasado || 0)
  }));

  const graficoPercentual = dados.map(d => ({
    diaSemana: d.diaSemana,
    percentual: parseFloat(d.percentual_recebido || 0)
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">
            📊 Consulta 4: Análise Financeira por Pelada
          </h2>
          <p className="text-yellow-700 text-sm">
            Query com JOINs, funções de data (MAX, MIN), agregações e CASE para análise financeira detalhada.
          </p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FaChartLine className="text-yellow-600" />
            Análise Financeira
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
            <h2 className="text-xl font-semibold mb-4">Status de Pagamentos</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={graficoStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="diaSemana" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="recebido" stackId="a" fill="#10B981" name="Recebido" />
                <Bar dataKey="pendente" stackId="a" fill="#F59E0B" name="Pendente" />
                <Bar dataKey="atrasado" stackId="a" fill="#EF4444" name="Atrasado" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Percentual Recebido</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={graficoPercentual}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="diaSemana" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="percentual" stroke="#3B82F6" strokeWidth={2} name="% Recebido" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dia da Semana</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor Pelada</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rodadas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recebido</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pendente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Atrasado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">% Recebido</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Período</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dados.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaCalendarAlt className="text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900">{item.diaSemana}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      R$ {parseFloat(item.valor_pelada || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.rodadas_realizadas || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaDollarSign className="text-green-500 mr-1" />
                        <span className="text-sm font-medium text-green-600">
                          R$ {parseFloat(item.valor_recebido || 0).toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">
                      R$ {parseFloat(item.valor_pendente || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      R$ {parseFloat(item.valor_atrasado || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${item.percentual_recebido || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {parseFloat(item.percentual_recebido || 0).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.primeira_rodada && item.ultima_rodada ? (
                        <div>
                          <div>{new Date(item.primeira_rodada).toLocaleDateString()}</div>
                          <div className="text-xs">até {new Date(item.ultima_rodada).toLocaleDateString()}</div>
                        </div>
                      ) : "-"}
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

