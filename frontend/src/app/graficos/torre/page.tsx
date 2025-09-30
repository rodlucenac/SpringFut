import Link from "next/link";
import Image from "next/image";

const graficosTorre = [
  {
    nome: 'Custo Médio x Tipo de Campo',
    src: '/graficos/custo-medio-x-tipo-de-campo.png',
    alt: 'Gráfico Custo Médio x Tipo de Campo',
  },
  {
    nome: 'Faixa de Custo por Ocorrência',
    src: '/graficos/faixa-de-custo-por-ocorrencia.png',
    alt: 'Gráfico Faixa de Custo por Ocorrência',
  },
  {
    nome: 'Número de Peladas x Vezes na Semana',
    src: '/graficos/numero-de-peladas-x-vezes-na-semana.png',
    alt: 'Gráfico Número de Peladas x Vezes na Semana',
  },
  {
    nome: 'Ocorrência x Duração',
    src: '/graficos/ocorrencia-x-duracao.png',
    alt: 'Gráfico Ocorrência x Duração',
  },
  {
    nome: 'Ocorrência x Número de Peladas',
    src: '/graficos/ocorrencia-x-numero-de-peladas.png',
    alt: 'Gráfico Ocorrência x Número de Peladas',
  },
];

const Torre: React.FC = () => (
  <div className="min-h-screen bg-gray-50 py-8 px-4 flex flex-col items-center">
    <div className="w-full max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Gráficos de Torre</h2>
        <Link href="/graficos">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition"
            type="button"
          >
            Voltar para Gráficos
          </button>
        </Link>
      </div>
      <div className="grid gap-8">
        {graficosTorre.map((grafico) => (
          <div
            key={grafico.nome}
            className="bg-white rounded-xl shadow p-6 flex flex-col items-center border border-gray-200"
          >
            <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">{grafico.nome}</h3>
            <Image
              src={grafico.src}
              alt={grafico.alt}
              width={600}
              height={400}
              className="w-full max-w-lg h-auto border border-gray-300 rounded-md"
              style={{ background: "#f9fafb" }}
            />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Torre;