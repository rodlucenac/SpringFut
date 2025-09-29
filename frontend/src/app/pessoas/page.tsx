"use client";

import { useEffect, useState } from "react";
import { Pessoa } from "../types/Pessoa";

export default function PessoasPage() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [novaPessoa, setNovaPessoa] = useState<Partial<Pessoa>>({});
  const [editando, setEditando] = useState<number | null>(null);
  const [editPessoa, setEditPessoa] = useState<Partial<Pessoa>>({});
  const [salvando, setSalvando] = useState(false);

  // Buscar pessoas
  useEffect(() => {
    fetch("http://localhost:8080/api/pessoas")
      .then((res) => res.json())
      .then(setPessoas)
      .catch(() => setErro("Erro ao buscar pessoas"))
      .finally(() => setLoading(false));
  }, []);

  // Criar pessoa
  function criarPessoa(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    setErro("");
    setSucesso("");
    fetch("http://localhost:8080/api/pessoas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novaPessoa),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao criar pessoa");
        return res.json();
      })
      .then((p) => {
        setPessoas((old) => [...old, p]);
        setSucesso("Pessoa adicionada com sucesso!");
        setNovaPessoa({});
      })
      .catch(() => setErro("Erro ao criar pessoa"))
      .finally(() => setSalvando(false));
  }

  // Editar pessoa
  function salvarEdicao(id: number) {
    setSalvando(true);
    setErro("");
    setSucesso("");
    fetch(`http://localhost:8080/api/pessoas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editPessoa),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao editar pessoa");
        setPessoas((old) =>
          old.map((p) => (p.idPessoa === id ? { ...p, ...editPessoa } : p))
        );
        setEditando(null);
        setEditPessoa({});
        setSucesso("Pessoa editada com sucesso!");
      })
      .catch(() => setErro("Erro ao editar pessoa"))
      .finally(() => setSalvando(false));
  }

  // Excluir pessoa
  function excluirPessoa(id: number) {
    setSalvando(true);
    setErro("");
    setSucesso("");
    fetch(`http://localhost:8080/api/pessoas/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao excluir pessoa");
        setPessoas((old) => old.filter((p) => p.idPessoa !== id));
        setSucesso("Pessoa excluída com sucesso!");
      })
      .catch(() => setErro("Erro ao excluir pessoa"))
      .finally(() => setSalvando(false));
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Gerenciar Pessoas</h1>
      {erro && <div className="text-red-600 bg-red-50 border border-red-200 rounded px-4 py-2 mb-4">{erro}</div>}
      {sucesso && <div className="text-green-600 bg-green-50 border border-green-200 rounded px-4 py-2 mb-4">{sucesso}</div>}
      
      {/* Formulário de criação */}
      <form
        onSubmit={criarPessoa}
        className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md mb-8"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Adicionar Nova Pessoa</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <input
            required
            placeholder="Nome completo"
            className="border border-gray-300 px-3 py-2 rounded-md text-gray-800 placeholder-gray-500 bg-white focus:border-blue-500 focus:outline-none"
            value={novaPessoa.nome || ""}
            onChange={(e) => setNovaPessoa({ ...novaPessoa, nome: e.target.value })}
            disabled={salvando}
          />
          <input
            placeholder="DDD"
            className="border border-gray-300 px-3 py-2 rounded-md text-gray-800 placeholder-gray-500 bg-white focus:border-blue-500 focus:outline-none"
            value={novaPessoa.telefoneDDD || ""}
            onChange={(e) => setNovaPessoa({ ...novaPessoa, telefoneDDD: e.target.value })}
            disabled={salvando}
          />
          <input
            placeholder="Número do telefone"
            className="border border-gray-300 px-3 py-2 rounded-md text-gray-800 placeholder-gray-500 bg-white focus:border-blue-500 focus:outline-none"
            value={novaPessoa.telefoneNumero || ""}
            onChange={(e) => setNovaPessoa({ ...novaPessoa, telefoneNumero: e.target.value })}
            disabled={salvando}
          />
          <input
            required
            type="email"
            placeholder="Email"
            className="border border-gray-300 px-3 py-2 rounded-md text-gray-800 placeholder-gray-500 bg-white focus:border-blue-500 focus:outline-none"
            value={novaPessoa.email || ""}
            onChange={(e) => setNovaPessoa({ ...novaPessoa, email: e.target.value })}
            disabled={salvando}
          />
          <input
            required
            placeholder="Senha"
            type="password"
            className="border border-gray-300 px-3 py-2 rounded-md text-gray-800 placeholder-gray-500 bg-white focus:border-blue-500 focus:outline-none"
            value={novaPessoa.senha || ""}
            onChange={(e) => setNovaPessoa({ ...novaPessoa, senha: e.target.value })}
            disabled={salvando}
          />
        </div>
        <button 
          className="mt-4 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-md transition-colors disabled:opacity-50" 
          disabled={salvando}
        >
          {salvando ? "Salvando..." : "Adicionar Pessoa"}
        </button>
      </form>

      {/* Tabela de pessoas */}
      {loading ? (
        <div className="text-gray-600">Carregando...</div>
      ) : (
        <div className="w-full max-w-6xl bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-gray-700 font-semibold">Nome</th>
                <th className="px-4 py-3 text-left text-gray-700 font-semibold">Telefone</th>
                <th className="px-4 py-3 text-left text-gray-700 font-semibold">Email</th>
                <th className="px-4 py-3 text-left text-gray-700 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {pessoas.map((p) => (
                <tr key={p.idPessoa} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {editando === p.idPessoa ? (
                      <input
                        value={editPessoa.nome || p.nome}
                        onChange={(e) => setEditPessoa({ ...editPessoa, nome: e.target.value })}
                        className="border border-gray-300 px-2 py-1 rounded text-gray-800 bg-white focus:border-blue-500 focus:outline-none"
                        disabled={salvando}
                      />
                    ) : (
                      <span className="text-gray-800">{p.nome}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editando === p.idPessoa ? (
                      <div className="flex gap-1">
                        <input
                          value={editPessoa.telefoneDDD || p.telefoneDDD || ""}
                          onChange={(e) => setEditPessoa({ ...editPessoa, telefoneDDD: e.target.value })}
                          className="border border-gray-300 px-2 py-1 rounded w-16 text-gray-800 bg-white focus:border-blue-500 focus:outline-none"
                          placeholder="DDD"
                          disabled={salvando}
                        />
                        <input
                          value={editPessoa.telefoneNumero || p.telefoneNumero || ""}
                          onChange={(e) => setEditPessoa({ ...editPessoa, telefoneNumero: e.target.value })}
                          className="border border-gray-300 px-2 py-1 rounded text-gray-800 bg-white focus:border-blue-500 focus:outline-none"
                          placeholder="Número"
                          disabled={salvando}
                        />
                      </div>
                    ) : (
                      <span className="text-gray-800">
                        {p.telefoneDDD ? `(${p.telefoneDDD}) ${p.telefoneNumero || ""}` : p.telefoneNumero || "-"}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editando === p.idPessoa ? (
                      <input
                        type="email"
                        value={editPessoa.email || p.email}
                        onChange={(e) => setEditPessoa({ ...editPessoa, email: e.target.value })}
                        className="border border-gray-300 px-2 py-1 rounded text-gray-800 bg-white focus:border-blue-500 focus:outline-none"
                        disabled={salvando}
                      />
                    ) : (
                      <span className="text-gray-800">{p.email}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {editando === p.idPessoa ? (
                        <>
                          <button
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors disabled:opacity-50"
                            onClick={() => salvarEdicao(p.idPessoa)}
                            disabled={salvando}
                          >
                            Salvar
                          </button>
                          <button
                            className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm transition-colors disabled:opacity-50"
                            onClick={() => {
                              setEditando(null);
                              setEditPessoa({});
                            }}
                            disabled={salvando}
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors disabled:opacity-50"
                            onClick={() => {
                              setEditando(p.idPessoa);
                              setEditPessoa({});
                            }}
                            disabled={salvando}
                          >
                            Editar
                          </button>
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors disabled:opacity-50"
                            onClick={() => {
                              if (confirm("Tem certeza que deseja excluir esta pessoa?")) {
                                excluirPessoa(p.idPessoa);
                              }
                            }}
                            disabled={salvando}
                          >
                            Excluir
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {pessoas.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    Nenhuma pessoa cadastrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Botão voltar */}
      <div className="mt-8">
        <button
          onClick={() => window.history.back()}
          className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-6 py-2 rounded-md transition-colors"
        >
          ← Voltar
        </button>
      </div>
    </main>
  );
}
