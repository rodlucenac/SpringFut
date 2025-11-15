"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Pessoa } from "../../types/Pessoa";

export default function EditarPerfilPage() {
  const router = useRouter();
  const [pessoa, setPessoa] = useState<Pessoa | null>(null);
  const [editPessoa, setEditPessoa] = useState<Partial<Pessoa>>({});
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

    // Buscar dados da pessoa usando idJogador
    fetch(`http://localhost:8080/api/pessoas/jogador/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar dados");
        return res.json();
      })
      .then((data: Pessoa) => {
        setPessoa(data);
        setEditPessoa({
          nome: data.nome,
          telefoneDDD: data.telefoneDDD,
          telefoneNumero: data.telefoneNumero,
          email: data.email,
        });
      })
      .catch(() => setErro("Erro ao carregar dados do perfil"))
      .finally(() => setLoading(false));
  }, [router]);

  const salvarPerfil = (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    setErro("");
    setSucesso("");

    const userId = localStorage.getItem("userId");
    if (!userId) return;

    fetch(`http://localhost:8080/api/pessoas/jogador/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editPessoa),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao salvar");
        setSucesso("Perfil atualizado com sucesso!");
        if (pessoa) {
          setPessoa({ ...pessoa, ...editPessoa });
        }
      })
      .catch(() => setErro("Erro ao salvar perfil"))
      .finally(() => setSalvando(false));
  };

  const excluirPerfil = () => {
    if (!confirm("Tem certeza que deseja excluir seu perfil? Esta ação não pode ser desfeita.")) {
      return;
    }

    setSalvando(true);
    setErro("");
    setSucesso("");

    const userId = localStorage.getItem("userId");
    if (!userId) return;

    fetch(`http://localhost:8080/api/pessoas/jogador/${userId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao excluir");
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        alert("Perfil excluído com sucesso!");
        router.push("/login");
      })
      .catch(() => setErro("Erro ao excluir perfil"))
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
          <h1 className="text-2xl font-bold text-gray-800">Editar Perfil</h1>
          <button
            onClick={() => router.push("/perfil")}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            ← Voltar
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        {erro && <div className="text-red-500 mb-4 p-4 bg-red-50 rounded">{erro}</div>}
        {sucesso && <div className="text-green-600 mb-4 p-4 bg-green-50 rounded">{sucesso}</div>}

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={salvarPerfil}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome *
              </label>
              <input
                required
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500"
                value={editPessoa.nome || ""}
                onChange={(e) => setEditPessoa({ ...editPessoa, nome: e.target.value })}
                disabled={salvando}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  DDD
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500"
                  value={editPessoa.telefoneDDD || ""}
                  onChange={(e) => setEditPessoa({ ...editPessoa, telefoneDDD: e.target.value })}
                  disabled={salvando}
                  maxLength={5}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500"
                  value={editPessoa.telefoneNumero || ""}
                  onChange={(e) => setEditPessoa({ ...editPessoa, telefoneNumero: e.target.value })}
                  disabled={salvando}
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                required
                type="email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500"
                value={editPessoa.email || ""}
                onChange={(e) => setEditPessoa({ ...editPessoa, email: e.target.value })}
                disabled={salvando}
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                disabled={salvando}
              >
                {salvando ? "Salvando..." : "Salvar Alterações"}
              </button>
              
              <button
                type="button"
                onClick={excluirPerfil}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                disabled={salvando}
              >
                Excluir Perfil
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
