"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface ValorFaltante {
  idRodada: number;
  valorTotal: number;
  valorPago: number;
  valorFaltante: number;
  percentualPago: number;
}

export default function FinanceiroRodadaPage() {
  const params = useParams();
  const [dados, setDados] = useState<ValorFaltante | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8080/api/consultas/rodadas/${params.id}/valor-faltante`)
      .then(res => res.json())
      .then(data => {
        setDados(data);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Situação Financeira da Rodada</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card Valor Total */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-500 text-sm mb-2">Valor Total</div>
            <div className="text-2xl font-bold text-gray-800">
              R$ {dados?.valorTotal.toFixed(2)}
            </div>
          </div>
          
          {/* Card Valor Pago */}
          <div className="bg-green-50 rounded-lg shadow p-6">
            <div className="text-green-700 text-sm mb-2">Valor Pago</div>
            <div className="text-2xl font-bold text-green-600">
              R$ {dados?.valorPago.toFixed(2)}
            </div>
            <div className="text-xs text-green-600 mt-1">
              {dados?.percentualPago.toFixed(1)}% do total
            </div>
          </div>
          
          {/* Card Valor Faltante */}
          <div className="bg-red-50 rounded-lg shadow p-6">
            <div className="text-red-700 text-sm mb-2">Valor Faltante</div>
            <div className="text-2xl font-bold text-red-600">
              R$ {dados?.valorFaltante.toFixed(2)}
            </div>
            <div className="text-xs text-red-600 mt-1">
              {(100 - (dados?.percentualPago || 0)).toFixed(1)}% pendente
            </div>
          </div>
        </div>
        
        {/* Barra de Progresso */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <div className="mb-2 flex justify-between">
            <span className="text-sm font-medium">Progresso de Pagamentos</span>
            <span className="text-sm font-medium">{dados?.percentualPago.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-green-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${dados?.percentualPago}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

