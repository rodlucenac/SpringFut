# ⚽ SpringFut

Este projeto tem como objetivo organizar **peladas de futebol amador** que ocorrem semanalmente em dia, horário e local fixos.  
O sistema gerencia inscrições, confirmações de presença, pagamentos, formação de times e estatísticas de desempenho dos jogadores.  

---

## 📌 Mini-mundo

- Cada **Pessoa** cadastrada no sistema possui dados básicos (nome, telefone, e-mail).  
- Uma pessoa pode ser **Jogador** e/ou **Organizador**.  
- **Jogadores** podem ter apelidos (multivalorados) e uma posição preferida em campo.  
- **Organizadores** podem criar peladas e **delegar funções** a outros organizadores (auto-relacionamento).  
- Uma **Pelada** representa o evento recorrente (mesmo dia e horário da semana, mesmo local).  
- Jogadores se vinculam à pelada através de um **Vínculo Jogador–Pelada**, que registra:  
  - Estrelas (1 a 5) atribuídas pelo organizador,  
  - Tipo de participação (Mensalista, Diarista, Fila),  
  - Papel (Jogador ou Organizador).  
- Cada semana gera uma **Rodada** (ex: Pelada da terça, dia 17/09/25).  
- Jogadores confirmam presença em uma rodada através de uma **Inscrição**.  
- Uma rodada pode ter várias **Partidas** (ex: Time A × Time B, Time C × Time D).  
- Dentro de uma rodada, são criados **Times**, formados apenas por jogadores confirmados.  
- Jogadores realizam **Pagamentos** para cada rodada, que podem ser via PIX, dinheiro ou cartão.  
- O sistema registra **Estatísticas** dos jogadores, em três níveis:  
  - **Histórico da Pelada** (acumulado de todas as rodadas),  
  - **Rodada específica** (desempenho em uma data),  
  - **Partida específica** (estatísticas detalhadas em um jogo).  
  Para simplificar, estatísticas ficam em **uma única tabela**, que usa as chaves (Pelada, Rodada, Partida) para identificar o nível.  

---

## 📌 Entidades

1. **Pessoa**: idPessoa, nome, telefone[ddd, número], email  
2. **Jogador**: idJogador (FK), posiçãoPreferida, apelidos {multivalorado}  
3. **Organizador**: idOrganizador (FK), cargo  
   - Auto-relacionamento: *Organizador delega para Organizador*  
4. **Pelada**: idPelada, diaSemana, horário, valorTotal, limiteMensalistas, tempoConfMensalista, tempoConfDiarista, endereço[rua, número, bairro, cidade, campo]  
5. **Vínculo Jogador–Pelada**: idVinculo, idJogador (FK), idPelada (FK), estrelas, tipoParticipacao, papelNaPelada  
6. **Rodada**: idRodada, data, idPelada (FK)  
7. **Inscrição**: idInscricao, idJogador (FK), idRodada (FK), statusConfirmacao, dataResposta  
8. **Partida**: idPartida, idRodada (FK), placarTimeA, placarTimeB  
9. **Time**: idTime, cor, idRodada (FK)  
10. **Pagamento**: idPagamento, valor, forma, status, data, idJogador (FK), idRodada (FK)  
11. **Estatísticas**: idEst, idJogador (FK), idPelada (FK), idRodada (FK, opcional), idPartida (FK, opcional), gols, assistencias, participacoes, GA  

---

## 📌 Relacionamentos

- **Pessoa → Jogador / Organizador**: especialização (1:1, sobreposta).  
- **Organizador ↔ Organizador**: delegação (1:N).  
- **Pelada ↔ Rodada**: 1:N.  
- **Rodada ↔ Partida**: 1:N.  
- **Rodada ↔ Time**: 1:N.  
- **Jogador ↔ Pelada (via Vínculo)**: N:N, com atributos.  
- **Jogador ↔ Rodada (via Inscrição)**: N:N, com atributos.  
- **Time ↔ Jogador**: 1:N dentro da rodada.  
- **Jogador ↔ Rodada (via Pagamento)**: N:N.  
- **Jogador ↔ Estatísticas**: 1:1 em cada nível (pelada, rodada, partida).  

---

## ✅ Requisitos atendidos

- Mais de **8 entidades** → 11 no total.  
- **Entidade fraca** → Estatísticas.  
- **Cardinalidades diversas** → 1:1, 1:N, N:N.  
- **Entidades associativas** → Vínculo Jogador–Pelada, Inscrição, Pagamento.  
- **Auto-relacionamento** → Organizador ↔ Organizador (delegação).  
- **Especialização** → Pessoa → Jogador / Organizador.  
- **Atributos simples, compostos, multivalorados** → nome/cargo/valor (simples), telefone e endereço (compostos), apelidos (multivalorados).  

---
