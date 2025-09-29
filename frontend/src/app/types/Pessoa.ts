export interface Pessoa {
  idPessoa: number;
  nome: string;
  telefoneDDD?: string;
  telefoneNumero?: string;
  email: string;
  senha?: string; // só para cadastro/edição
}
