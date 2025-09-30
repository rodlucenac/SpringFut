import Link from "next/link";
import Image from "next/image";

const graficos = [
  {
    nome: 'Custo Médio x Duração',
    src: '/graficos/custo-medio-x-duracao.png',
    alt: 'Gráfico Custo Médio x Duração',
  },
  {
    nome: 'Custo Médio x Frequência de Peladas',
    src: '/graficos/custo-medio-x-frequencia-de-peladas.png',
    alt: 'Gráfico Custo Médio x Frequência de Peladas',
  },
  {
    nome: 'Custo Médio x Número de Peladas',
    src: '/graficos/custo-medio-x-numero-de-peladas.png',
    alt: 'Gráfico Custo Médio x Número de Peladas',
  },
  {
    nome: 'Custo Médio x Tipo de Campo',
    src: '/graficos/media-custo-x-tipo-campo.png',
    alt: 'Gráfico Custo Médio x Tipo de Campo',
  },
  {
    nome: 'Número de Peladas x Duração',
    src: '/graficos/numero-de-peladas-x-duracao.png',
    alt: 'Gráfico Número de Peladas x Duração',
  },
];

const Dispersao: React.FC = () => (
  <div className="min-h-screen bg-gray-50 py-8 px-4 flex flex-col items-center">
    <div className="w-full max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Gráficos de Dispersão</h2>
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
        {graficos.map((grafico) => (
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

export default Dispersao;