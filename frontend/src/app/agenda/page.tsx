"use client";

import { useEffect, useState } from "react";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUsers } from "react-icons/fa";

interface AgendaItem {
  idRodada: number;
  data: string;
  diaSemana: string;
  horario: string;
  valorTotal: number;
  rua: string;
  bairro: string;
  nomeOrganizador: string;
  contatoOrganizador: string;
  confirmados: number;
  pendentes: number;
  ausentes: number;
}

export default function AgendaPage() {
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetch("http://localhost:8080/api/consultas/views/agenda-peladas")
      .then(async res => {
        const data = await res.json();
        
        // Se a resposta não foi ok, verificar se há mensagem de erro
        if (!res.ok) {
          const errorMessage = data?.erro || data?.message || `Erro ${res.status}: ${res.statusText}`;
          throw new Error(errorMessage);
        }
        
        return data;
      })
      .then(data => {
        // Garantir que data é sempre um array
        if (Array.isArray(data)) {
          setAgenda(data);
        } else if (data && typeof data === 'object' && data.erro) {
          // Se for um objeto de erro, tratar
          setError(data.erro || "Erro desconhecido");
          setAgenda([]);
        } else {
          // Se não for array nem erro, tentar como array vazio
          console.warn("Resposta inesperada da API:", data);
          setAgenda([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar agenda:", err);
        setError(err.message || "Erro ao carregar agenda. Verifique se o backend está rodando.");
        setAgenda([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-purple-800 mb-2">
            📊 View: vw_agenda_peladas_organizadores
          </h2>
          <p className="text-purple-700 text-sm">
            Esta view consolida informações de múltiplas tabelas (Rodada, 
            Pelada, Endereco, VinculoJogadorPelada, Pessoa, Inscricao) para 
            fornecer uma visão completa da agenda operacional.
          </p>
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Agenda de Peladas</h1>
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
            <div className="text-gray-600">Carregando agenda...</div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-800 font-semibold mb-2">Erro</div>
            <div className="text-red-600">{error}</div>
          </div>
        ) : agenda.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
            <div className="text-gray-600 text-lg mb-2">Nenhuma rodada encontrada</div>
            <div className="text-gray-500 text-sm">Não há rodadas cadastradas no momento.</div>
          </div>
        ) : (
          <div className="space-y-4">
            {agenda.map(item => (
              <div 
                key={item.idRodada} 
                className="bg-white rounded-lg shadow p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {item.diaSemana}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-blue-500" />
                        <span>{new Date(item.data).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaClock className="text-green-500" />
                        <span>{item.horario}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      R$ {item.valorTotal.toFixed(2)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <FaMapMarkerAlt className="text-red-500" />
                  <span>{item.rua}, {item.bairro}</span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-500">Organizador</div>
                      <div className="font-medium">{item.nomeOrganizador}</div>
                      <div className="text-sm text-gray-500">{item.contatoOrganizador}</div>
                    </div>
                    
                    <div className="flex gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {item.confirmados}
                        </div>
                        <div className="text-xs text-gray-500">Confirmados</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                          {item.pendentes}
                        </div>
                        <div className="text-xs text-gray-500">Pendentes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {item.ausentes}
                        </div>
                        <div className="text-xs text-gray-500">Ausentes</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

