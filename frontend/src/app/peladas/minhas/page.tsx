"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MinhasPeladasPage() {
  const [peladas, setPeladas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setPeladas([]);
      setLoading(false);
      return;
    }
    fetch(`http://localhost:8080/api/peladas?organizadorId=${userId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Erro ao buscar peladas");
        return res.json();
      })
      .then((data) => {
        // Mapeia os campos do backend para o formato esperado pelo frontend
        setPeladas(
          data.map((p: any) => ({
            id: p.idPelada,
            nome: p.diaSemana || p.nome || "Pelada",
            endereco: p.endereco?.rua || p.endereco || "-",
            bairro: p.endereco?.bairro || p.bairro || "-",
            diaSemana: p.diaSemana,
            horario: p.horario,
            limiteMensalistas: p.limiteMensalistas,
            valorTotal: p.valorTotal,
          }))
        );
      })
      .catch((err) => setErro(err.message))
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-green-100 via-green-50 to-white px-4">
      <div className="w-full max-w-3xl mt-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-green-700">Minhas peladas</h1>
          <button
            className="text-green-700 hover:text-green-900 border border-green-200 rounded px-3 py-1 bg-green-50 text-sm font-semibold"
            onClick={() => router.push("/peladas/nova")}
          >
            + Nova pelada
          </button>
        </div>
        {loading && <div className="text-green-700">Carregando...</div>}
        {erro && (
          <div className="text-red-600 animate-fade-in text-center mb-4">
            {erro}
          </div>
        )}
        {!loading && peladas.length === 0 && !erro && (
          <div className="text-gray-500">
            Você ainda não criou nenhuma pelada.
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {peladas.map((pelada: any) => (
            <div
              key={pelada.id}
              className="bg-white rounded-2xl shadow p-6 border border-green-100 flex flex-col gap-2 animate-fade-in"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg font-bold text-green-700">
                  {pelada.nome}
                </span>
                <span className="text-xs bg-green-100 text-green-700 rounded px-2 py-0.5 ml-auto">
                  {pelada.diaSemana} {pelada.horario}
                </span>
              </div>
              <div className="text-gray-600 text-sm">
                {pelada.endereco} - {pelada.bairro}
              </div>
              <div className="flex gap-4 text-xs text-gray-500 mt-1">
                <span>Limite: {pelada.limiteMensalistas}</span>
                <span>Valor: R$ {pelada.valorTotal?.toFixed(2)}</span>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  className="px-4 py-1 bg-yellow-100 text-yellow-800 rounded font-semibold border border-yellow-200 hover:bg-yellow-200 transition text-xs"
                  onClick={() => router.push(`/peladas/editar/${pelada.id}`)}
                >
                  Editar
                </button>
                <button
                  className="px-4 py-1 bg-red-100 text-red-700 rounded font-semibold border border-red-200 hover:bg-red-200 transition text-xs"
                  onClick={async () => {
                    if (
                      confirm("Tem certeza que deseja excluir esta pelada?")
                    ) {
                      try {
                        const res = await fetch(
                          `http://localhost:8080/api/peladas/${pelada.id}`,
                          { method: "DELETE" }
                        );
                        if (!res.ok) throw new Error("Erro ao excluir pelada");
                        setPeladas(
                          peladas.filter((p: any) => p.id !== pelada.id)
                        );
                      } catch (e: any) {
                        setErro(e.message || "Erro ao excluir pelada");
                      }
                    }
                  }}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
