"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaPlus,
  FaSearch,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
} from "react-icons/fa";

interface Pelada {
  id: number;
  nome: string;
  endereco: string;
  bairro: string;
  diaSemana: string;
  horario: string;
  duracao: string;
  jogadores: number;
  limite: number;
  valor: number;
  imagem?: string;
}

// Interface para dados vindos do backend
interface PeladaBackend {
  idPelada: number;
  diaSemana: string;
  horario: string;
  valorTotal: number;
  limiteMensalistas: number;
  tempoConfMensalista?: number;
  tempoConfDiarista?: number;
  endereco?: {
    rua?: string;
    bairro?: string;
  };
}

export default function PeladasPage() {
  const [peladas, setPeladas] = useState<Pelada[]>([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:8080/api/peladas")
      .then((res) => res.json())
      .then((data: PeladaBackend[]) => {
        setPeladas(
          data.map((p: PeladaBackend) => ({
            id: p.idPelada,
            nome: p.diaSemana || "Pelada",
            endereco: p.endereco?.rua || "-",
            bairro: p.endereco?.bairro || "-",
            diaSemana: p.diaSemana,
            horario: p.horario,
            duracao: "-",
            jogadores: 0,
            limite: p.limiteMensalistas || 0,
            valor: p.valorTotal || 0,
            imagem: "/file.svg",
          }))
        );
        setLoading(false);
      })
      .catch(() => {
        setPeladas([]);
        setLoading(false);
      });
  }, []);

  const peladasFiltradas = peladas.filter(
    (p) =>
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.endereco.toLowerCase().includes(busca.toLowerCase()) ||
      p.bairro.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 border-b border-gray-200">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
          FutSpring
        </h1>
        <div className="flex gap-2">
          <button
            className="text-green-700 hover:text-green-900 border border-green-200 rounded px-3 py-1 bg-green-50 text-sm font-semibold flex items-center gap-1"
            onClick={() => router.push("/peladas/minhas")}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M16 3v4M8 3v4M3 11h18"
              />
            </svg>
            Minhas peladas
          </button>
          <button
            className="text-blue-700 hover:text-blue-900 border border-blue-200 rounded px-3 py-1 bg-blue-50 text-sm font-semibold flex items-center gap-1"
            onClick={() => router.push("/perfil/editar")}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
              />
              <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
            Meu Perfil
          </button>
          <a
            href="/peladas/nova"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg shadow transition"
          >
            <FaPlus /> Criar Pelada
          </a>
        </div>
      </header>

      {/* Busca */}
      <div className="flex justify-center mt-8">
        <div className="w-full max-w-xl flex items-center bg-white rounded-lg shadow px-4 py-2 border border-gray-200">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 bg-transparent outline-none text-gray-700 text-base"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>

      {/* Lista de peladas */}
      <section className="flex flex-col items-center mt-8">
        <div className="w-full max-w-2xl">
          {loading ? (
            <div className="text-center text-gray-400 py-16">Carregando...</div>
          ) : peladasFiltradas.length === 0 ? (
            <div className="text-center text-gray-400 py-16">
              Nenhuma pelada cadastrada.
              <br />
              <a
                href="/peladas/nova"
                className="inline-block mt-4 px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition"
              >
                Criar nova pelada
              </a>
            </div>
          ) : (
            peladasFiltradas.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-bold text-gray-800">{p.nome}</h2>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                    Open
                  </span>
                </div>
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={p.imagem}
                    alt={p.nome}
                    className="w-full md:w-64 h-40 object-cover rounded-xl border border-gray-200 bg-gray-100"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="mb-2">
                      <div className="flex items-center gap-2 text-green-700 text-sm mb-1">
                        <FaMapMarkerAlt />
                        <span>{p.endereco}</span>
                        <span className="text-gray-400">{p.bairro}</span>
                      </div>
                      <div className="flex items-center gap-4 text-gray-600 text-sm mb-1">
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt /> {p.diaSemana}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt /> {p.horario} • {p.duracao}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                        <FaUsers />
                        <span>
                          {p.jogadores}/{p.limite} players
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full bg-green-500"
                          style={{
                            width: `${(p.jogadores / p.limite) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex items-end justify-between mt-2">
                      <div>
                        <span className="text-xl font-bold text-gray-800">
                          R$ {p.valor.toFixed(2)}
                        </span>
                        <span className="text-gray-400 text-sm ml-1">
                          por pessoa
                        </span>
                      </div>
                      <a
                        href={`/peladas/${p.id}`}
                        className="px-5 py-2 bg-green-50 border border-green-600 text-green-700 font-bold rounded-lg hover:bg-green-100 transition text-sm"
                      >
                        Ver detalhes
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-gray-400 text-sm border-t mt-8">
        © {new Date().getFullYear()} Futspring, All rights reserved.
      </footer>
    </main>
  );
}
