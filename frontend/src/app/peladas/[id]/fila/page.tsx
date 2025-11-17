"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

export default function GestaoFilaPage() {
  const params = useParams();
  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function promoverJogadores() {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/peladas/${params.id}/promover-fila`,
        { method: "POST" }
      );
      
      const data = await response.json();
      setResultado(data);
      
    } catch (error) {
      alert("Erro ao promover jogadores");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Gestão de Fila</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Promover Jogadores da Fila
          </h2>
          <p className="text-gray-600 mb-4">
            Este procedimento promove automaticamente jogadores da fila
            para mensalistas, respeitando o limite de vagas e a ordem
            de prioridade (estrelas).
          </p>
          
          <button
            onClick={promoverJogadores}
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Processando..." : "Promover Jogadores"}
          </button>
        </div>
        
        {resultado && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Resultado da Promoção
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-green-700">Jogadores Promovidos:</span>
                <span className="font-bold text-green-900">
                  {resultado.jogadoresPromovidos}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Vagas Restantes:</span>
                <span className="font-bold text-green-900">
                  {resultado.vagasRestantes}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

