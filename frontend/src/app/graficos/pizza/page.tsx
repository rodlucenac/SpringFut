import Link from "next/link";
import Image from "next/image";

const graficosPizza = [
  {
    nome: 'Jogadores por Tipo de Campo',
    src: '/graficos/jogadores-por-tipo-de-campo.png',
    alt: 'Gráfico Jogadores por Tipo de Campo',
  },
  {
    nome: 'Porcentagem por Quantidade de Vezes na Semana',
    src: '/graficos/porcentagem-por-quantidade-de-vezes-na-semana.png',
    alt: 'Gráfico Porcentagem por Quantidade de Vezes na Semana',
  },
  {
    nome: 'Quantidade por Local',
    src: '/graficos/quantidade-por-local.png',
    alt: 'Gráfico Quantidade por Local',
  },
];

const Pizza: React.FC = () => (
  <div className="min-h-screen bg-gray-50 py-8 px-4 flex flex-col items-center">
    <div className="w-full max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Gráficos de Pizza</h2>
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
        {graficosPizza.map((grafico) => (
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

export default Pizza;