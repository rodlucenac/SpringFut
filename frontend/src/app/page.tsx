"use client";

import {
  FaFutbol,
  FaUsers,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTrophy,
} from "react-icons/fa";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-green-50 to-white text-center px-4">
      {/* Badge topo */}
      <div className="flex items-center gap-2 mb-4 px-4 py-1 rounded-full bg-white shadow text-green-700 text-sm font-semibold">
        <FaFutbol className="text-green-500" />
        <span>Organize suas peladas</span>
      </div>

      {/* Título */}
      <h1 className="text-5xl md:text-6xl font-extrabold mb-2">
        Spring<span className="text-green-600">Fut</span>
      </h1>

      {/* Subtítulo */}
      <p className="mt-2 text-lg md:text-xl text-gray-600 max-w-xl">
        A maneira mais fácil de organizar e participar de peladas com seus
        amigos.
        <br />
        Crie jogos, convide a galera e faça gol!
      </p>

      {/* Botões principais */}
      <div className="flex gap-4 mt-8 flex-wrap justify-center">
        <a
          href="/login"
          className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg shadow hover:bg-green-700 transition text-lg"
        >
          Entrar
        </a>
        <a
          href="/register"
          className="px-8 py-3 border-2 border-green-600 text-green-700 font-bold rounded-lg hover:bg-green-50 transition text-lg"
        >
          Cadastrar
        </a>
      </div>

      {/* Opções secundárias */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-14 w-full max-w-3xl">
        <div className="flex flex-col items-center p-5 bg-white rounded-xl shadow text-green-700 hover:bg-green-50 transition">
          <FaUsers className="text-3xl mb-2 text-green-500" />
          <span className="font-medium">Organize times</span>
        </div>
        <div className="flex flex-col items-center p-5 bg-white rounded-xl shadow text-green-700 hover:bg-green-50 transition">
          <FaMapMarkerAlt className="text-3xl mb-2 text-green-500" />
          <span className="font-medium">Encontre quadras</span>
        </div>
        <div className="flex flex-col items-center p-5 bg-white rounded-xl shadow text-green-700 hover:bg-green-50 transition">
          <FaCalendarAlt className="text-3xl mb-2 text-green-500" />
          <span className="font-medium">Agende jogos</span>
        </div>
        <div className="flex flex-col items-center p-5 bg-white rounded-xl shadow text-green-700 hover:bg-green-50 transition">
          <FaTrophy className="text-3xl mb-2 text-green-500" />
          <span className="font-medium">Acompanhe stats</span>
        </div>
      </div>
    </main>
  );
}
