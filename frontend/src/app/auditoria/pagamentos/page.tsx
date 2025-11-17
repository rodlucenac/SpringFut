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

  useEffect(() => {
    fetch("http://localhost:8080/api/pagamentos/logs")
      .then(res => res.json())
      .then(data => {
        setLogs(data);
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
            tabela Pagamento, registrando a operação na tabela PagamentoLog
            para auditoria financeira.
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
          <div>Carregando logs...</div>
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
                  <tr key={log.idLog}>
                    <td className="px-6 py-4 text-sm">{log.idLog}</td>
                    <td className="px-6 py-4 text-sm">{log.idPagamento}</td>
                    <td className="px-6 py-4 text-sm">{log.idJogador}</td>
                    <td className="px-6 py-4 text-sm">
                      R$ {log.valor.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        log.status === 'Pago' ? 'bg-green-100 text-green-800' :
                        log.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(log.dataEvento).toLocaleString('pt-BR')}
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

