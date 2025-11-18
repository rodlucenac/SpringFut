"use client";

import { useEffect, useState } from "react";
import { FaFutbol, FaDollarSign, FaChartLine } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function PeladasAcimaMediaArrecadadaPage() {
  const [peladas, setPeladas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetch("http://localhost:8080/api/consultas/peladas-acima-media-arrecadada")
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
          setPeladas(data);
        } else {
          setPeladas([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar peladas:", err);
        setError(err.message || "Erro ao carregar peladas. Verifique se o backend está rodando.");
        setPeladas([]);
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
  const graficoData = peladas
    .map(p => ({
      diaSemana: p.diaSemana,
      totalPago: parseFloat(p.totalPago) || 0
    }))
    .sort((a, b) => b.totalPago - a.totalPago);

  const totalArrecadado = peladas.reduce((acc, p) => acc + parseFloat(p.totalPago || 0), 0);
  const mediaPorPelada = peladas.length > 0 ? totalArrecadado / peladas.length : 0;

  // Agrupar por dia da semana
  const porDiaSemana = peladas.reduce((acc, p) => {
    const dia = p.diaSemana;
    if (!acc[dia]) {
      acc[dia] = { dia, total: 0, count: 0 };
    }
    acc[dia].total += parseFloat(p.totalPago || 0);
    acc[dia].count += 1;
    return acc;
  }, {} as Record<string, { dia: string; total: number; count: number }>);

  const dadosPorDia = Object.values(porDiaSemana).map(d => ({
    dia: d.dia,
    total: d.total,
    media: d.total / d.count
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-cyan-800 mb-2">
            📊 Consulta 4: Peladas Acima da Média Arrecadada (Subconsulta Correlacionada)
          </h2>
          <p className="text-cyan-700 text-sm">
            Query usando subconsulta correlacionada na cláusula HAVING para encontrar peladas que arrecadaram acima da média no mesmo dia da semana.
          </p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FaChartLine className="text-cyan-600" />
            Peladas Acima da Média Arrecadada
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

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600 mb-1">Total de Peladas</div>
            <div className="text-2xl font-bold text-gray-900">{peladas.length}</div>
          </div>
          <div className="bg-green-50 rounded-lg shadow p-4 border border-green-200">
            <div className="text-sm text-green-600 mb-1">Total Arrecadado</div>
            <div className="text-2xl font-bold text-green-900">
              R$ {totalArrecadado.toFixed(2)}
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg shadow p-4 border border-blue-200">
            <div className="text-sm text-blue-600 mb-1">Média por Pelada</div>
            <div className="text-2xl font-bold text-blue-900">
              R$ {mediaPorPelada.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Arrecadação por Pelada</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={graficoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="diaSemana" />
                <YAxis />
                <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
                <Legend />
                <Bar dataKey="totalPago" fill="#06B6D4" name="Total Arrecadado (R$)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Média por Dia da Semana</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosPorDia}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
                <Legend />
                <Bar dataKey="media" fill="#10B981" name="Média Arrecadada (R$)" />
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Pelada</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dia da Semana</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Arrecadado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {peladas
                  .sort((a, b) => parseFloat(b.totalPago || 0) - parseFloat(a.totalPago || 0))
                  .map((pelada) => {
                    const total = parseFloat(pelada.totalPago || 0);
                    return (
                      <tr key={pelada.idPelada} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {pelada.idPelada}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {pelada.diaSemana}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <FaDollarSign className="text-green-500" />
                            <span className="text-sm font-semibold text-green-600">
                              R$ {total.toFixed(2)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            total >= mediaPorPelada * 1.5 ? "bg-green-100 text-green-800" :
                            total >= mediaPorPelada * 1.2 ? "bg-blue-100 text-blue-800" :
                            "bg-yellow-100 text-yellow-800"
                          }`}>
                            {total >= mediaPorPelada * 1.5 ? "Excelente" :
                             total >= mediaPorPelada * 1.2 ? "Muito Bom" : "Acima da Média"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

        {peladas.length === 0 && !error && (
          <div className="bg-white rounded-lg shadow p-12 text-center mt-6">
            <FaFutbol className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600">Nenhuma pelada encontrada acima da média</p>
          </div>
        )}
      </div>
    </div>
  );
}

