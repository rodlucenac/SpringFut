"use client";

import { useEffect, useState } from "react";
import { FaCalendarAlt, FaFutbol, FaUsers } from "react-icons/fa";

export default function RodadasFuturasPage() {
  const [rodadas, setRodadas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/consultas/rodadas-futuras")
      .then(res => res.json())
      .then(data => {
        setRodadas(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-purple-800 mb-2">
            📊 Consulta 5: Rodadas Futuras
          </h2>
          <p className="text-purple-700 text-sm">
            Query com JOIN simples entre Rodada, Pelada e Endereco, com filtro de data futura.
          </p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FaCalendarAlt className="text-purple-600" />
            Rodadas Futuras
          </h1>
          <div className="flex gap-2">
            <a
              href="/dashboard"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
            >
              Dashboard
            </a>
            <a
              href="/agenda"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
            >
              Agenda
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rodadas.map((rodada) => (
            <div key={rodada.idRodada} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FaFutbol className="text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-800">{rodada.diaSemana}</h3>
                </div>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
                  {new Date(rodada.data).toLocaleDateString()}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium mr-2">Horário:</span>
                  <span>{rodada.horario}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium mr-2">Valor:</span>
                  <span className="font-semibold text-green-600">R$ {parseFloat(rodada.valorTotal || 0).toFixed(2)}</span>
                </div>
                {rodada.endereco && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium mr-2">Local:</span>
                    <span>{rodada.endereco}, {rodada.bairro}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-4 border-t">
                <FaUsers className="text-gray-400" />
                <span className="text-sm text-gray-600">
                  <span className="font-medium">{rodada.inscritos || 0}</span> inscritos
                </span>
              </div>
            </div>
          ))}
        </div>

        {rodadas.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FaCalendarAlt className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600">Nenhuma rodada futura cadastrada</p>
          </div>
        )}
      </div>
    </div>
  );
}

