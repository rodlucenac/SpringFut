"use client";

import { useEffect, useState } from "react";
import { FaFutbol, FaUser } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Jogador {
  idJogador: number;
  nome: string;
  email: string;
  posicaoPreferida: string;
  totalPeladas: number;
  apelidos: string;
}

export default function JogadoresPosicaoPage() {
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/consultas/jogadores-posicao")
      .then(res => res.json())
      .then(data => {
        setJogadores(data);
        setLoading(false);
      });
  }, []);

  // Agrupar por posição para gráfico
  const dadosGrafico = jogadores.reduce((acc: any, jogador) => {
    const posicao = jogador.posicaoPreferida || "Não definida";
    if (!acc[posicao]) {
      acc[posicao] = 0;
    }
    acc[posicao]++;
    return acc;
  }, {});

  const graficoData = Object.entries(dadosGrafico).map(([posicao, quantidade]) => ({
    posicao,
    quantidade
  }));

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">
            📊 Consulta 1: Jogadores com Posições
          </h2>
          <p className="text-blue-700 text-sm">
            Query com JOIN entre Jogador e Pessoa, agregação (COUNT) e GROUP_CONCAT para apelidos multivalorados.
          </p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FaFutbol className="text-blue-600" />
            Jogadores por Posição
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

        {/* Gráfico */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Distribuição por Posição</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={graficoData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="posicao" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="quantidade" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posição</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Peladas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Apelidos</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jogadores.map((jogador) => (
                  <tr key={jogador.idJogador} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaUser className="text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900">{jogador.nome}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {jogador.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {jogador.posicaoPreferida || "Não definida"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {jogador.totalPeladas}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {jogador.apelidos || "-"}
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

