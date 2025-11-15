"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaPlus,
  FaSearch,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
  FaTimes,
  FaEdit,
  FaTrash,
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

interface RodadaOption {
  idRodada: number;
  data: string | null;
}

interface Inscricao {
  idInscricao: number;
  idJogador: number;
  idRodada: number;
  statusConfirmacao: string;
  dataResposta?: string | null;
}

const STATUS_OPTIONS: Array<Inscricao["statusConfirmacao"]> = [
  "Pendente",
  "Confirmado",
  "Ausente",
];

export default function PeladasPage() {
  const [peladas, setPeladas] = useState<Pelada[]>([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedPelada, setSelectedPelada] = useState<Pelada | null>(null);
  const [inscricaoModalOpen, setInscricaoModalOpen] = useState(false);
  const [rodadasDisponiveis, setRodadasDisponiveis] = useState<RodadaOption[]>(
    []
  );
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [inscricaoLoading, setInscricaoLoading] = useState(false);
  const [editingInscricao, setEditingInscricao] = useState<Inscricao | null>(
    null
  );
  const [feedback, setFeedback] = useState<
    { type: "success" | "error"; message: string } | null
  >(null);
  const [inscricaoRecemCriada, setInscricaoRecemCriada] = useState<
    Inscricao | null
  >(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [inscricaoPagamento, setInscricaoPagamento] = useState<
    Inscricao | null
  >(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentFeedback, setPaymentFeedback] = useState<
    { type: "success" | "error"; message: string } | null
  >(null);
  const [form, setForm] = useState({
    idRodada: "",
    statusConfirmacao: "Pendente",
  });
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("userId");
    setUserId(storedUser);
  }, []);

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

  const resetInscricaoForm = (rodadas?: RodadaOption[]) => {
    setForm({
      idRodada: rodadas && rodadas[0] ? String(rodadas[0].idRodada) : "",
      statusConfirmacao: "Pendente",
    });
    setEditingInscricao(null);
  };

  const closeModal = () => {
    setInscricaoModalOpen(false);
    setSelectedPelada(null);
    setRodadasDisponiveis([]);
    setInscricoes([]);
    resetInscricaoForm();
    setFeedback(null);
  };

  const formatDate = (value?: string | null) => {
    if (!value) return "-";
    return new Date(`${value}T00:00:00`).toLocaleDateString("pt-BR");
  };

  const loadInscricaoData = async (peladaId: number, jogador: number) => {
    setInscricaoLoading(true);
    try {
      const [rodadasResp, inscricoesResp] = await Promise.all([
        fetch(`http://localhost:8080/api/peladas/${peladaId}/rodadas`),
        fetch(
          `http://localhost:8080/api/inscricoes?idJogador=${encodeURIComponent(
            jogador
          )}`
        ),
      ]);

      if (!rodadasResp.ok) {
        throw new Error("Erro ao carregar rodadas da pelada.");
      }
      if (!inscricoesResp.ok) {
        throw new Error("Erro ao carregar suas inscrições.");
      }

      const rodadasData: unknown = await rodadasResp.json();
      const inscricoesData: unknown = await inscricoesResp.json();
      const rodadasList: RodadaOption[] = Array.isArray(rodadasData)
        ? (rodadasData as RodadaOption[])
        : [];
      const rodadasIds = new Set(rodadasList.map((r) => r.idRodada));
      const inscricoesList: Inscricao[] = Array.isArray(inscricoesData)
        ? (inscricoesData as Inscricao[])
        : [];
      const filtradas = inscricoesList.filter((insc) =>
        rodadasIds.has(insc.idRodada)
      );

      setRodadasDisponiveis(rodadasList);
      setInscricoes(filtradas);
      resetInscricaoForm(rodadasList);
      if (rodadasList.length === 0) {
        setFeedback({
          type: "error",
          message: "Esta pelada ainda não possui rodadas cadastradas.",
        });
      }
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Não foi possível carregar as inscrições.",
      });
      setRodadasDisponiveis([]);
      setInscricoes([]);
    } finally {
      setInscricaoLoading(false);
    }
  };

  const handleInscreverClick = (pelada: Pelada) => {
    if (!userId) {
      router.push("/login");
      return;
    }
    setSelectedPelada(pelada);
    setInscricaoModalOpen(true);
    setFeedback(null);
    resetInscricaoForm();
    loadInscricaoData(pelada.id, parseInt(userId, 10));
  };

  const handleFormChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userId || !selectedPelada) {
      setFeedback({
        type: "error",
        message: "É necessário estar logado para se inscrever.",
      });
      return;
    }

    if (!form.idRodada) {
      setFeedback({
        type: "error",
        message: "Selecione uma rodada para se inscrever.",
      });
      return;
    }

    const jogadorId = parseInt(userId, 10);
    const payload = {
      idJogador: jogadorId,
      idRodada: Number(form.idRodada),
      statusConfirmacao: form.statusConfirmacao,
    };

    const url = editingInscricao
      ? `http://localhost:8080/api/inscricoes/${editingInscricao.idInscricao}`
      : "http://localhost:8080/api/inscricoes";
    const method = editingInscricao ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.erro || "Erro ao salvar inscrição.");
      }

      let novaInscricao: Inscricao | null = null;
      if (!editingInscricao) {
        novaInscricao = await response.json().catch(() => null);
      } else {
        await response.json().catch(() => null);
      }

      setFeedback({
        type: "success",
        message: editingInscricao
          ? "Inscrição atualizada com sucesso."
          : "Inscrição criada com sucesso.",
      });
      await loadInscricaoData(selectedPelada.id, jogadorId);
      setInscricaoRecemCriada(novaInscricao || null);
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error ? error.message : "Falha ao salvar inscrição.",
      });
      setInscricaoRecemCriada(null);
    }
  };

  const handleEdit = (inscricao: Inscricao) => {
    setEditingInscricao(inscricao);
    setForm({
      idRodada: String(inscricao.idRodada),
      statusConfirmacao: inscricao.statusConfirmacao,
    });
    setFeedback(null);
    setInscricaoRecemCriada(null);
  };

  const handleDelete = async (inscricaoId: number) => {
    if (!selectedPelada || !userId) return;
    try {
      const response = await fetch(
        `http://localhost:8080/api/inscricoes/${inscricaoId}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.erro || "Não foi possível excluir.");
      }
      setFeedback({
        type: "success",
        message: "Inscrição removida.",
      });
      await loadInscricaoData(selectedPelada.id, parseInt(userId, 10));
      setInscricaoRecemCriada(null);
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Erro ao excluir a inscrição.",
      });
    }
  };

  const getRodadaDescricao = (rodadaId: number) => {
    const rodada = rodadasDisponiveis.find((r) => r.idRodada === rodadaId);
    if (!rodada) return `Rodada ${rodadaId}`;
    return `Rodada ${rodada.idRodada} - ${formatDate(rodada.data)}`;
  };

  const abrirPagamento = (inscricao: Inscricao) => {
    setInscricaoPagamento(inscricao);
    setPaymentFeedback(null);
    setPaymentModalOpen(true);
  };

  const confirmarPagamento = async () => {
    if (!selectedPelada || !userId || !inscricaoPagamento) {
      setPaymentFeedback({
        type: "error",
        message: "Selecione uma inscrição válida para pagar.",
      });
      return;
    }
    const valor = selectedPelada.valor || 0;
    if (valor <= 0) {
      setPaymentFeedback({
        type: "error",
        message: "Valor da pelada não configurado.",
      });
      return;
    }

    setPaymentProcessing(true);
    try {
      const response = await fetch("http://localhost:8080/api/pagamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idJogador: parseInt(userId, 10),
          idRodada: inscricaoPagamento.idRodada,
          valor,
          forma: "PIX",
          status: "Pago",
        }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.erro || "Não foi possível registrar o pagamento.");
      }
      await response.json().catch(() => null);
      setPaymentFeedback({
        type: "success",
        message: "Pagamento registrado com sucesso!",
      });
      await loadInscricaoData(selectedPelada.id, parseInt(userId, 10));
      setTimeout(() => {
        setPaymentModalOpen(false);
        setInscricaoPagamento(null);
        setPaymentFeedback(null);
      }, 1200);
    } catch (error) {
      setPaymentFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Erro inesperado ao processar o pagamento.",
      });
    } finally {
      setPaymentProcessing(false);
    }
  };

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
              <circle
                cx="12"
                cy="7"
                r="4"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
            Meu Perfil
          </button>
          <a
            href="/peladas/nova"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg shadow transition"
          >
            <FaPlus /> Criar Pelada
          </a>
          <Link
            href="/graficos"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg shadow transition"
          >
            Gráficos
          </Link>
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
                            width: `${p.limite ? (p.jogadores / p.limite) * 100 : 0}%`,
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
                      <button
                        type="button"
                        className="px-5 py-2 bg-green-50 border border-green-600 text-green-700 font-bold rounded-lg hover:bg-green-100 transition text-sm"
                        onClick={() => handleInscreverClick(p)}
                      >
                        Me inscrever
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Modal de inscrição */}
      {inscricaoModalOpen && selectedPelada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">Pelada selecionada</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {selectedPelada.nome}
                </h3>
                <p className="text-gray-500 text-sm">
                  {selectedPelada.diaSemana} • {selectedPelada.horario}
                </p>
              </div>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700"
                onClick={closeModal}
              >
                <FaTimes size={20} />
              </button>
            </div>

            {inscricaoLoading ? (
              <div className="text-center py-10 text-gray-500">
                Carregando dados de inscrição...
              </div>
            ) : (
              <div className="space-y-4">
                {feedback && (
                  <div
                    className={`px-4 py-3 rounded-lg text-sm ${
                      feedback.type === "success"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {feedback.message}
                  </div>
                )}

                {feedback?.type === "success" && inscricaoRecemCriada && (
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border border-green-200 bg-green-50 px-4 py-3 rounded-lg">
                    <div>
                      <p className="text-sm text-green-700 font-semibold">
                        Inscrição pronta para pagamento via PIX.
                      </p>
                      <p className="text-xs text-green-700">
                        {getRodadaDescricao(inscricaoRecemCriada.idRodada)}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700"
                      onClick={() => abrirPagamento(inscricaoRecemCriada)}
                    >
                      Ir para pagamento
                    </button>
                  </div>
                )}

                {rodadasDisponiveis.length === 0 ? (
                  <p className="text-center text-gray-500 py-6">
                    Esta pelada ainda não possui rodadas cadastradas. Entre em
                    contato com o organizador.
                  </p>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    <form
                      className="p-4 border border-gray-200 rounded-xl bg-gray-50"
                      onSubmit={handleSubmit}
                    >
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">
                        {editingInscricao
                          ? "Editar inscrição"
                          : "Nova inscrição"}
                      </h4>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">
                        Rodada
                      </label>
                      <select
                        name="idRodada"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
                        value={form.idRodada}
                        onChange={handleFormChange}
                      >
                        {rodadasDisponiveis.map((rodada) => (
                          <option key={rodada.idRodada} value={rodada.idRodada}>
                            {getRodadaDescricao(rodada.idRodada)}
                          </option>
                        ))}
                      </select>

                      <label className="block text-sm font-semibold text-gray-600 mb-1">
                        Status
                      </label>
                      <select
                        name="statusConfirmacao"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
                        value={form.statusConfirmacao}
                        onChange={handleFormChange}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>

                      <div className="flex gap-3 mt-2">
                        <button
                          type="submit"
                          className="flex-1 bg-green-600 text-white font-semibold rounded-lg py-2 hover:bg-green-700 transition"
                        >
                          {editingInscricao ? "Atualizar" : "Inscrever"}
                        </button>
                        {editingInscricao && (
                          <button
                            type="button"
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100"
                            onClick={() => {
                              resetInscricaoForm(rodadasDisponiveis);
                              setFeedback(null);
                            }}
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </form>

                    <div className="p-4 border border-gray-200 rounded-xl">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">
                        Minhas inscrições
                      </h4>
                      {inscricoes.length === 0 ? (
                        <p className="text-gray-500 text-sm">
                          Você ainda não se inscreveu nas rodadas desta pelada.
                        </p>
                      ) : (
                        <ul className="space-y-3">
                          {inscricoes.map((inscricao) => (
                            <li
                              key={inscricao.idInscricao}
                              className="border border-gray-200 rounded-lg p-3 flex flex-col gap-2"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-semibold text-gray-800">
                                    {getRodadaDescricao(inscricao.idRodada)}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Status: {inscricao.statusConfirmacao}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Resposta: {formatDate(inscricao.dataResposta)}
                                  </p>
                                </div>
                                <div className="flex flex-wrap gap-2 justify-end">
                                  <button
                                    type="button"
                                    className="text-blue-600 hover:text-blue-800"
                                    onClick={() => handleEdit(inscricao)}
                                  >
                                    <FaEdit />
                                  </button>
                                  <button
                                    type="button"
                                    className="text-red-600 hover:text-red-800"
                                    onClick={() =>
                                      handleDelete(inscricao.idInscricao)
                                    }
                                  >
                                    <FaTrash />
                                  </button>
                                  <button
                                    type="button"
                                    className="px-3 py-1 border border-green-300 text-green-700 rounded-md text-xs font-semibold hover:bg-green-50"
                                    onClick={() => abrirPagamento(inscricao)}
                                  >
                                    Ir para pagamento
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de pagamento */}
      {paymentModalOpen && selectedPelada && inscricaoPagamento && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500">Pagamento via PIX</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {selectedPelada.nome}
                </h3>
                <p className="text-gray-500 text-sm">
                  {getRodadaDescricao(inscricaoPagamento.idRodada)}
                </p>
              </div>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setPaymentModalOpen(false);
                  setInscricaoPagamento(null);
                  setPaymentFeedback(null);
                }}
              >
                <FaTimes />
              </button>
            </div>

            {paymentFeedback && (
              <div
                className={`mb-4 px-4 py-2 rounded-lg text-sm ${
                  paymentFeedback.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {paymentFeedback.message}
              </div>
            )}

            <div className="space-y-3">
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-500">Valor da pelada</p>
                <p className="text-2xl font-bold text-gray-800">
                  R$ {(selectedPelada.valor ?? 0).toFixed(2)}
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-500">Forma de pagamento</p>
                <p className="text-lg font-semibold text-gray-800">PIX</p>
                <p className="text-xs text-gray-500 mt-1">
                  Ao confirmar, registramos o pagamento e atualizamos sua inscrição para confirmado.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
                onClick={() => {
                  setPaymentModalOpen(false);
                  setInscricaoPagamento(null);
                  setPaymentFeedback(null);
                }}
                disabled={paymentProcessing}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-60"
                onClick={confirmarPagamento}
                disabled={paymentProcessing}
              >
                {paymentProcessing ? "Processando..." : "Confirmar PIX"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full py-6 text-center text-gray-400 text-sm border-t mt-8">
        © {new Date().getFullYear()} Futspring, All rights reserved.
      </footer>
    </main>
  );
}
