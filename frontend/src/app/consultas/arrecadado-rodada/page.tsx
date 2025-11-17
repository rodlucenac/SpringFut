"use client";

import { useEffect, useState } from "react";
import { FaDollarSign, FaChartBar } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function ArrecadadoRodadaPage() {
  const [dados, setDados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/consultas/arrecadado-rodada")
      .then(res => res.json())
      .then(data => {
        setDados(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Carregando...</div>;

  // Preparar dados para gráfico
  const graficoData = dados.map(d => ({
    rodada: `R${d.idRodada} - ${new Date(d.data).toLocaleDateString()}`,
    arrecadado: parseFloat(d.total_arrecadado || 0),
    pagos: d.pagos || 0,
    pendentes: d.pendentes || 0
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-indigo-800 mb-2">
            📊 Consulta 6: Valor Arrecadado por Rodada
          </h2>
          <p className="text-indigo-700 text-sm">
            Query com GROUP BY, agregações (SUM, AVG, COUNT) e CASE para análise de pagamentos por rodada.
          </p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FaDollarSign className="text-indigo-600" />
            Arrecadação por Rodada
          </h1>
          <div className="flex gap-2">
            <a
              href="/dashboard"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
            >
              Dashboard
            </a>
            <a
              href="/consultas/analise-financeira"
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition text-sm font-medium"
            >
              Análise Financeira
            </a>
          </div>
        </div>

        {/* Gráfico */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Arrecadação Total por Rodada</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={graficoData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rodada" angle={-45} textAnchor="end" height={120} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="arrecadado" fill="#3B82F6" name="Total Arrecadado (R$)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rodada</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dia</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Arrecadado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor Médio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pagamentos</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pagos</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pendentes</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dados.map((item) => (
                  <tr key={item.idRodada} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-900">#{item.idRodada}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.data).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                        {item.diaSemana}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaDollarSign className="text-green-500 mr-1" />
                        <span className="text-sm font-bold text-green-600">
                          R$ {parseFloat(item.total_arrecadado || 0).toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      R$ {parseFloat(item.valor_medio || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.total_pagamentos || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {item.pagos || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        {item.pendentes || 0}
                      </span>
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

