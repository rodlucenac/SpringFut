"use client";

import { useEffect, useState } from "react";
import { FaFutbol, FaExclamationTriangle, FaClock, FaUsers } from "react-icons/fa";

export default function PeladasSemOrganizadorPage() {
  const [peladas, setPeladas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetch("http://localhost:8080/api/consultas/peladas-sem-organizador")
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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            📊 Consulta 1: Peladas sem Organizador (Anti Join)
          </h2>
          <p className="text-red-700 text-sm">
            Query usando LEFT JOIN com condição WHERE para encontrar peladas que não possuem organizador associado (anti join).
          </p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FaExclamationTriangle className="text-red-600" />
            Peladas sem Organizador
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

        {peladas.length === 0 && !error ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FaFutbol className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600">Todas as peladas possuem organizador associado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {peladas.map((pelada) => (
              <div key={pelada.idPelada} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition border-l-4 border-red-500">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FaFutbol className="text-red-600" />
                    <h3 className="text-lg font-semibold text-gray-800">{pelada.diaSemana}</h3>
                  </div>
                  <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                    Sem Organizador
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <FaClock className="mr-2 text-gray-400" />
                    <span className="font-medium mr-2">Horário:</span>
                    <span>{pelada.horario}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FaUsers className="mr-2 text-gray-400" />
                    <span className="font-medium mr-2">Limite Mensalistas:</span>
                    <span>{pelada.limiteMensalistas || "Não definido"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {peladas.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dia da Semana</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Horário</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Limite Mensalistas</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {peladas.map((pelada) => (
                    <tr key={pelada.idPelada} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {pelada.idPelada}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {pelada.diaSemana}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {pelada.horario}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {pelada.limiteMensalistas || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

