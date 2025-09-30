import Link from 'next/link';

const Graficos: React.FC = () => (
  <div className="min-h-screen bg-gray-50 py-8 px-4 flex flex-col items-center">
    <div className="w-full max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Gráficos</h1>
        <Link href="/peladas">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition"
            type="button"
          >
            Voltar para Peladas
          </button>
        </Link>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <li>
          <Link href="/graficos/pizza" className="block bg-white rounded-xl shadow p-6 text-center text-lg font-semibold text-blue-700 hover:bg-blue-50 transition border border-gray-200">
            Pizza
          </Link>
        </li>
        <li>
          <Link href="/graficos/torre" className="block bg-white rounded-xl shadow p-6 text-center text-lg font-semibold text-blue-700 hover:bg-blue-50 transition border border-gray-200">
            Torre
          </Link>
        </li>
        <li>
          <Link href="/graficos/dispersao" className="block bg-white rounded-xl shadow p-6 text-center text-lg font-semibold text-blue-700 hover:bg-blue-50 transition border border-gray-200">
            Dispersão
          </Link>
        </li>
        <li>
          <Link href="/graficos/outros" className="block bg-white rounded-xl shadow p-6 text-center text-lg font-semibold text-blue-700 hover:bg-blue-50 transition border border-gray-200">
            Outros
          </Link>
        </li>
      </ul>
    </div>
  </div>
);

export default Graficos;