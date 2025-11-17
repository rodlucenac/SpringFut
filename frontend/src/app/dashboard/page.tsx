"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, PieChart, Pie, LineChart, Line,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell, ScatterChart, Scatter
} from "recharts";
import { 
  FaFutbol, FaUsers, FaCalendarAlt, FaDollarSign,
  FaChartBar, FaChartPie, FaChartLine
} from "react-icons/fa";

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6'];

export default function DashboardPage() {
  const [indicadores, setIndicadores] = useState<any>(null);
  const [distribuicaoPosicoes, setDistribuicaoPosicoes] = useState([]);
  const [statusPagamentos, setStatusPagamentos] = useState([]);
  const [evolucaoArrecadacao, setEvolucaoArrecadacao] = useState([]);
  const [confirmacoesPorRodada, setConfirmacoesPorRodada] = useState([]);
  const [correlacao, setCorrelacao] = useState([]);
  const [topJogadores, setTopJogadores] = useState([]);
  const [estatisticas, setEstatisticas] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Filtros interativos
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [limiteRodadas, setLimiteRodadas] = useState(10);

  const fetchData = async () => {
    const API = "http://localhost:8080/api/dashboard";
    
    try {
      // Construir query params para evolução de arrecadação
      const paramsEvolucao = new URLSearchParams();
      if (dataInicio) paramsEvolucao.append("dataInicio", dataInicio);
      if (dataFim) paramsEvolucao.append("dataFim", dataFim);
      
      const paramsConfirmacoes = new URLSearchParams();
      paramsConfirmacoes.append("limite", limiteRodadas.toString());
      
      const [
        indRes, distRes, pagRes, evRes, confRes, corrRes, topRes, statsRes
      ] = await Promise.all([
        fetch(`${API}/indicadores`),
        fetch(`${API}/graficos/distribuicao-posicoes`),
        fetch(`${API}/graficos/status-pagamentos`),
        fetch(`${API}/graficos/evolucao-arrecadacao?${paramsEvolucao.toString()}`),
        fetch(`${API}/graficos/confirmacoes-rodada?${paramsConfirmacoes.toString()}`),
        fetch(`${API}/graficos/correlacao-peladas-estrelas`),
        fetch(`${API}/graficos/perfil-top-jogadores`),
        fetch(`${API}/estatisticas/descritivas`)
      ]);

      setIndicadores(await indRes.json());
      setDistribuicaoPosicoes(await distRes.json());
      setStatusPagamentos(await pagRes.json());
      setEvolucaoArrecadacao(await evRes.json());
      setConfirmacoesPorRodada(await confRes.json());
      setCorrelacao(await corrRes.json());
      setTopJogadores(await topRes.json());
      setEstatisticas(await statsRes.json());
      
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dataInicio, dataFim, limiteRodadas]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-600">
          Carregando Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Dashboard Estatístico
            </h1>
            <p className="text-gray-600">
              Análise completa dos dados do SpringFut
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href="/peladas"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
            >
              Ver Peladas
            </a>
            <a
              href="/consultas/jogadores-posicao"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
            >
              Consultas
            </a>
          </div>
        </div>

        {/* ========== FILTROS INTERATIVOS ========== */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Início
              </label>
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Fim
              </label>
              <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Limite de Rodadas
              </label>
              <select
                value={limiteRodadas}
                onChange={(e) => setLimiteRodadas(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5 rodadas</option>
                <option value={10}>10 rodadas</option>
                <option value={20}>20 rodadas</option>
                <option value={50}>50 rodadas</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setDataInicio("");
                  setDataFim("");
                  setLimiteRodadas(10);
                }}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* ========== INDICADORES RESUMIDOS ========== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Total de Peladas</p>
                <p className="text-3xl font-bold text-green-600">
                  {indicadores?.totalPeladas}
                </p>
              </div>
              <FaFutbol className="text-4xl text-green-200" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Jogadores Ativos</p>
                <p className="text-3xl font-bold text-blue-600">
                  {indicadores?.jogadoresAtivos}
                </p>
              </div>
              <FaUsers className="text-4xl text-blue-200" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Rodadas Realizadas</p>
                <p className="text-3xl font-bold text-purple-600">
                  {indicadores?.rodadasRealizadas}
                </p>
              </div>
              <FaCalendarAlt className="text-4xl text-purple-200" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Total Arrecadado</p>
                <p className="text-3xl font-bold text-yellow-600">
                  R$ {indicadores?.totalArrecadado?.toFixed(2)}
                </p>
              </div>
              <FaDollarSign className="text-4xl text-yellow-200" />
            </div>
          </div>
        </div>

        {/* Cards Adicionais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Média de Jogadores/Rodada
            </h3>
            <p className="text-2xl font-bold text-indigo-600">
              {indicadores?.mediaJogadoresPorRodada?.toFixed(1)}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Taxa de Confirmação
            </h3>
            <p className="text-2xl font-bold text-green-600">
              {indicadores?.taxaConfirmacao?.percentual?.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {indicadores?.taxaConfirmacao?.confirmados} de{" "}
              {indicadores?.taxaConfirmacao?.total} inscrições
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Ticket Médio
            </h3>
            <p className="text-2xl font-bold text-orange-600">
              R$ {indicadores?.ticketMedio?.toFixed(2)}
            </p>
          </div>
        </div>

        {/* ========== GRÁFICO 1: DISTRIBUIÇÃO POR POSIÇÃO ========== */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FaChartBar className="text-2xl text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">
              Distribuição de Jogadores por Posição
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={distribuicaoPosicoes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="posicao" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="quantidade" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ========== GRÁFICO 2: STATUS DE PAGAMENTOS ========== */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FaChartPie className="text-2xl text-green-600" />
            <h2 className="text-2xl font-bold text-gray-800">
              Status de Pagamentos
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusPagamentos}
                dataKey="quantidade"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {statusPagamentos.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* ========== GRÁFICO 3: EVOLUÇÃO DE ARRECADAÇÃO ========== */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FaChartLine className="text-2xl text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-800">
              Evolução de Arrecadação ao Longo do Tempo
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={evolucaoArrecadacao}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="valorPago" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Valor Pago"
              />
              <Line 
                type="monotone" 
                dataKey="valorPendente" 
                stroke="#F59E0B" 
                strokeWidth={2}
                name="Valor Pendente"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ========== GRÁFICO 4: CONFIRMAÇÕES POR RODADA ========== */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Confirmações vs Ausências por Rodada (Últimas 10)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={confirmacoesPorRodada}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="confirmados" stackId="a" fill="#10B981" name="Confirmados" />
              <Bar dataKey="ausentes" stackId="a" fill="#EF4444" name="Ausentes" />
              <Bar dataKey="pendentes" stackId="a" fill="#F59E0B" name="Pendentes" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ========== GRÁFICO 5: CORRELAÇÃO ========== */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Correlação: Número de Peladas x Média de Estrelas
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="numeroPeladas" name="Peladas" />
              <YAxis dataKey="mediaEstrelas" name="Estrelas" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter 
                name="Jogadores" 
                data={correlacao} 
                fill="#8B5CF6"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* ========== GRÁFICO 6: PERFIL TOP 5 (RADAR) ========== */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Perfil dos Top 5 Jogadores
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={topJogadores}>
              <PolarGrid />
              <PolarAngleAxis dataKey="jogador" />
              <PolarRadiusAxis />
              <Radar 
                name="Gols" 
                dataKey="gols" 
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.6} 
              />
              <Radar 
                name="Assistências" 
                dataKey="assistencias" 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.6} 
              />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* ========== ESTATÍSTICAS DESCRITIVAS ========== */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Estatísticas Descritivas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gols */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-700">
                Análise de Gols
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Média:</span>
                  <span className="font-bold">
                    {estatisticas?.gols?.media?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Desvio Padrão:</span>
                  <span className="font-bold">
                    {estatisticas?.gols?.desvio_padrao?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Variância:</span>
                  <span className="font-bold">
                    {estatisticas?.gols?.variancia?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mínimo:</span>
                  <span className="font-bold">
                    {estatisticas?.gols?.minimo}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Máximo:</span>
                  <span className="font-bold">
                    {estatisticas?.gols?.maximo}
                  </span>
                </div>
              </div>
            </div>

            {/* Pagamentos */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-700">
                Análise de Pagamentos
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Média:</span>
                  <span className="font-bold">
                    R$ {estatisticas?.pagamentos?.media?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Desvio Padrão:</span>
                  <span className="font-bold">
                    R$ {estatisticas?.pagamentos?.desvio_padrao?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Variância:</span>
                  <span className="font-bold">
                    {estatisticas?.pagamentos?.variancia?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mínimo:</span>
                  <span className="font-bold">
                    R$ {estatisticas?.pagamentos?.minimo?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Máximo:</span>
                  <span className="font-bold">
                    R$ {estatisticas?.pagamentos?.maximo?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Distribuição de Frequência */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              Distribuição de Frequência de Presenças
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {estatisticas?.distribuicaoPresenca?.map((item: any, index: number) => (
                <div 
                  key={index}
                  className="bg-blue-50 border border-blue-200 rounded p-3 text-center"
                >
                  <div className="text-sm text-gray-600">{item.faixa}</div>
                  <div className="text-xl font-bold text-blue-600">
                    {item.quantidade}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

