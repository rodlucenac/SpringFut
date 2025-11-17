"use client";

import { useEffect, useState } from "react";

interface LogPagamento {
  idLog: number;
  idPagamento: number;
  idJogador: number;
  idRodada: number;
  valor: number;
  status: string;
  dataEvento: string;
  observacao: string;
}

export default function AuditoriaPagamentosPage() {
  const [logs, setLogs] = useState<LogPagamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetch("http://localhost:8080/api/pagamentos/logs")
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
          setLogs(data);
        } else if (data && typeof data === 'object' && data.erro) {
          setError(data.erro || "Erro desconhecido");
          setLogs([]);
        } else {
          console.warn("Resposta inesperada da API:", data);
          setLogs([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar logs:", err);
        setError(err.message || "Erro ao carregar logs de auditoria. Verifique se o backend está rodando e se a tabela PagamentoLog existe no banco de dados.");
        setLogs([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">
            🔍 Trigger: trg_pagamento_insert_log
          </h2>
          <p className="text-blue-700 text-sm">
            Este trigger é executado automaticamente APÓS cada INSERT na
            tabela Pagamento. A auditoria de pagamentos é feita consultando
            diretamente a tabela Pagamento, que já contém todas as informações
            necessárias para auditoria financeira.
          </p>
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Auditoria de Pagamentos</h1>
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
          <div className="text-center py-8">
            <div className="text-gray-600">Carregando logs de auditoria...</div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="text-red-800 font-semibold mb-2">⚠️ Erro</div>
            <div className="text-red-600 mb-4">{error}</div>
            <div className="text-sm text-red-700 bg-red-100 p-4 rounded">
              <p className="font-semibold mb-2">Possíveis causas:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>A tabela <code className="bg-red-200 px-1 rounded">Pagamento</code> não existe no banco de dados</li>
                <li>O backend não está rodando ou não consegue conectar ao banco</li>
                <li>Verifique a conexão com o banco de dados</li>
              </ul>
            </div>
          </div>
        ) : logs.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
            <div className="text-gray-600 text-lg mb-2">📋 Nenhum log de pagamento encontrado</div>
            <div className="text-gray-500 text-sm mb-4">
              Não há pagamentos registrados no sistema ainda. A auditoria consulta
              diretamente a tabela Pagamento, mostrando todos os pagamentos cadastrados.
            </div>
            <div className="text-xs text-gray-400 bg-gray-100 p-3 rounded inline-block">
              💡 Dica: Crie um pagamento para ver os registros de auditoria. A consulta
              é feita diretamente na tabela Pagamento, sem necessidade de tabela de log separada.
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ID Log
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Pagamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Jogador
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Data/Hora
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {logs.map(log => (
                  <tr key={log.idLog} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{log.idLog}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{log.idPagamento}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{log.idJogador}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                      R$ {log.valor?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        log.status === 'Pago' ? 'bg-green-100 text-green-800' :
                        log.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {log.dataEvento ? new Date(log.dataEvento).toLocaleString('pt-BR') : 'N/A'}
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

