"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  FaFutbol, FaUsers, FaChartBar, FaCalendarAlt, 
  FaTrophy, FaFileInvoiceDollar, FaShieldAlt, FaHome,
  FaSearch, FaChartLine, FaDollarSign, FaUser
} from "react-icons/fa";

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [userId, setUserId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setUserId(localStorage.getItem("userId"));
  }, []);

  const isActive = (path: string) => pathname === path;

  // Não renderizar até que o componente esteja montado no cliente
  if (!mounted) {
    return (
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/peladas" className="flex items-center gap-2">
              <FaFutbol className="text-green-600 text-2xl" />
              <span className="text-xl font-bold text-gray-800">
                Spring<span className="text-green-600">Fut</span>
              </span>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  // Páginas públicas que sempre mostram navegação
  const publicPages = ["/", "/login", "/register"];
  const isPublicPage = publicPages.includes(pathname || "");

  // Se não está logado e não é página pública, não mostrar navegação completa
  if (!userId && !isPublicPage) {
    return null;
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/peladas" className="flex items-center gap-2">
            <FaFutbol className="text-green-600 text-2xl" />
            <span className="text-xl font-bold text-gray-800">
              Spring<span className="text-green-600">Fut</span>
            </span>
          </Link>

          {/* Menu Principal */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/peladas"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                isActive("/peladas") 
                  ? "bg-green-100 text-green-700" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <FaFutbol />
                <span>Peladas</span>
              </div>
            </Link>

            <Link
              href="/dashboard"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                isActive("/dashboard") 
                  ? "bg-blue-100 text-blue-700" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <FaChartBar />
                <span>Dashboard</span>
              </div>
            </Link>

            <Link
              href="/agenda"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                isActive("/agenda") 
                  ? "bg-purple-100 text-purple-700" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <FaCalendarAlt />
                <span>Agenda</span>
              </div>
            </Link>

            <Link
              href="/ranking"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                isActive("/ranking") 
                  ? "bg-yellow-100 text-yellow-700" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <FaTrophy />
                <span>Ranking</span>
              </div>
            </Link>

            {/* Menu Consultas */}
            <div className="relative group">
              <button className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                pathname?.startsWith("/consultas") 
                  ? "bg-indigo-100 text-indigo-700" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}>
                <FaSearch />
                <span>Consultas</span>
              </button>
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="py-2">
                  <Link href="/consultas/jogadores-posicao" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <div className="flex items-center gap-2">
                      <FaUsers className="text-blue-500" />
                      <span>Jogadores por Posição</span>
                    </div>
                  </Link>
                  <Link href="/consultas/peladas-estatisticas" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <div className="flex items-center gap-2">
                      <FaFutbol className="text-green-500" />
                      <span>Estatísticas das Peladas</span>
                    </div>
                  </Link>
                  <Link href="/consultas/analise-financeira" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <div className="flex items-center gap-2">
                      <FaChartLine className="text-yellow-500" />
                      <span>Análise Financeira</span>
                    </div>
                  </Link>
                  <Link href="/consultas/rodadas-futuras" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-purple-500" />
                      <span>Rodadas Futuras</span>
                    </div>
                  </Link>
                  <Link href="/consultas/arrecadado-rodada" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <div className="flex items-center gap-2">
                      <FaDollarSign className="text-indigo-500" />
                      <span>Arrecadação por Rodada</span>
                    </div>
                  </Link>
                  <Link href="/consultas/jogador-resumo" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <div className="flex items-center gap-2">
                      <FaUser className="text-cyan-500" />
                      <span>Resumo dos Jogadores</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            <Link
              href="/auditoria/pagamentos"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                isActive("/auditoria") 
                  ? "bg-red-100 text-red-700" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <FaShieldAlt />
                <span>Auditoria</span>
              </div>
            </Link>

            <Link
              href="/perfil"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                isActive("/perfil") 
                  ? "bg-purple-100 text-purple-700" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <FaUser />
                <span>Perfil</span>
              </div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => {
                const menu = document.getElementById("mobile-menu");
                menu?.classList.toggle("hidden");
              }}
              className="text-gray-600 hover:text-gray-900"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div id="mobile-menu" className="hidden md:hidden pb-4">
          <div className="flex flex-col gap-2">
            <Link href="/peladas" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">
              Peladas
            </Link>
            <Link href="/dashboard" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">
              Dashboard
            </Link>
            <Link href="/agenda" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">
              Agenda
            </Link>
            <Link href="/ranking" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">
              Ranking
            </Link>
            <Link href="/consultas/jogadores-posicao" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">
              Consultas
            </Link>
            <Link href="/auditoria/pagamentos" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">
              Auditoria
            </Link>
            <Link href="/perfil" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">
              Perfil
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

