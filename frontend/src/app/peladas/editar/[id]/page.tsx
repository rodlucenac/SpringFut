"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditarPeladaPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  
  const [pelada, setPelada] = useState({
    diaSemana: "",
    horario: "",
    valorTotal: 0,
    limiteMensalistas: 20,
    endereco: "",
    bairro: "",
  });
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/login");
      return;
    }

    // Buscar dados da pelada
    fetch(`http://localhost:8080/api/peladas/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPelada({
          diaSemana: data.diaSemana || "",
          horario: data.horario || "",
          valorTotal: data.valorTotal || 0,
          limiteMensalistas: data.limiteMensalistas || 20,
          endereco: data.endereco || "",
          bairro: data.bairro || "",
        });
        setLoading(false);
      })
      .catch(() => {
        setErro("Erro ao carregar dados da pelada");
        setLoading(false);
      });
  }, [id, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    setErro("");
    setSucesso("");

    const userId = localStorage.getItem("userId");
    const dados = {
      ...pelada,
      organizadorId: parseInt(userId || "0"),
    };

    fetch(`http://localhost:8080/api/peladas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.erro) {
          setErro(data.erro);
        } else {
          setSucesso("Pelada atualizada com sucesso!");
          setTimeout(() => router.push("/peladas/minhas"), 1500);
        }
      })
      .catch(() => setErro("Erro ao atualizar pelada"))
      .finally(() => setSalvando(false));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Carregando...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Editar Pelada</h1>
          <button
            onClick={() => router.push("/peladas/minhas")}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            ← Voltar
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        {erro && (
          <div className="text-red-600 bg-red-50 border border-red-200 rounded px-4 py-2 mb-4">
            {erro}
          </div>
        )}
        {sucesso && (
          <div className="text-green-600 bg-green-50 border border-green-200 rounded px-4 py-2 mb-4">
            {sucesso}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Dia da Semana *
              </label>
              <select
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-gray-800 bg-white focus:border-blue-500 focus:outline-none"
                value={pelada.diaSemana}
                onChange={(e) => setPelada({ ...pelada, diaSemana: e.target.value })}
                disabled={salvando}
              >
                <option value="">Selecione...</option>
                <option value="Segunda-feira">Segunda-feira</option>
                <option value="Terça-feira">Terça-feira</option>
                <option value="Quarta-feira">Quarta-feira</option>
                <option value="Quinta-feira">Quinta-feira</option>
                <option value="Sexta-feira">Sexta-feira</option>
                <option value="Sábado">Sábado</option>
                <option value="Domingo">Domingo</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Horário *
              </label>
              <input
                type="time"
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-gray-800 bg-white focus:border-blue-500 focus:outline-none"
                value={pelada.horario}
                onChange={(e) => setPelada({ ...pelada, horario: e.target.value })}
                disabled={salvando}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Valor Total *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-gray-800 bg-white focus:border-blue-500 focus:outline-none"
                value={pelada.valorTotal}
                onChange={(e) => setPelada({ ...pelada, valorTotal: parseFloat(e.target.value) || 0 })}
                disabled={salvando}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Limite de Mensalistas *
              </label>
              <input
                type="number"
                min="1"
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-gray-800 bg-white focus:border-blue-500 focus:outline-none"
                value={pelada.limiteMensalistas}
                onChange={(e) => setPelada({ ...pelada, limiteMensalistas: parseInt(e.target.value) || 20 })}
                disabled={salvando}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Endereço
              </label>
              <input
                type="text"
                placeholder="Rua, número"
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-gray-800 placeholder-gray-500 bg-white focus:border-blue-500 focus:outline-none"
                value={pelada.endereco}
                onChange={(e) => setPelada({ ...pelada, endereco: e.target.value })}
                disabled={salvando}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Bairro
              </label>
              <input
                type="text"
                placeholder="Nome do bairro"
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-gray-800 placeholder-gray-500 bg-white focus:border-blue-500 focus:outline-none"
                value={pelada.bairro}
                onChange={(e) => setPelada({ ...pelada, bairro: e.target.value })}
                disabled={salvando}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
              disabled={salvando}
            >
              {salvando ? "Salvando..." : "Salvar Alterações"}
            </button>
            
            <button
              type="button"
              onClick={() => router.push("/peladas/minhas")}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
              disabled={salvando}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
