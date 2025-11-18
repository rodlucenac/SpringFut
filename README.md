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




## Escopo atendido

### CRUD completo de ao menos quatro tabelas
- **Pessoa** (`/api/pessoas`, páginas `frontend/src/app/pessoas` e `perfil/editar`) com criação, atualização, deleção e atualização de contato via procedure.
- **Pelada** (`/api/peladas`, páginas `peladas/`, `peladas/minhas`, `peladas/nova`, `peladas/editar/[id]`), incluindo endereço, rodadas e fila.
- **Inscricao** (`/api/inscricoes`, tela principal de peladas), validando status, datas e relação jogador/rodada.
- **Pagamento** (`/api/pagamentos`, fluxo de conferência financeira e auditoria), confirmando inscrições pagas automaticamente.

### Integração com funções, procedimentos e triggers
- `PessoaController.atualizarContato` chama a procedure `sp_atualizar_contato_pessoa` diretamente da tela `perfil/editar`.
- `PessoaController.classificacaoPorJogador` usa a função `fn_classificacao_assiduidade` e exibe o resultado em `perfil/page.tsx`.
- `ConsultaController.getValorFaltante` consome `fn_valor_faltante_rodada`, alimentando `rodadas/[id]/financeiro`.
- `InscricaoController` documenta e demonstra o trigger `trg_inscricao_status_resposta`, visível no histórico da inscrição.
- `PagamentoController.listarLogsAuditoria` expõe o efeito do trigger `trg_pagamento_insert_log`, acessível em `auditoria/pagamentos`.

### Consultas e views acessíveis na interface
- Telas em `frontend/src/app/consultas/**` e `agenda/`, `ranking/`, `rodadas/**` chamam os endpoints de `ConsultaController`, exibindo resultados com filtros e componentes visuais (tabelas, cards, gráficos Recharts).
- As views/consultas das etapas 3 e 4 (jogadores por posição, peladas com estatísticas, ranking, rodadas futuras, arrecadação por rodada, agenda de peladas) são carregadas via fetch e apresentadas com indicadores de contexto.

### Dashboard estatístico integrado
- **100% baseado no banco:** todas as seções em `frontend/src/app/dashboard/page.tsx` consomem os endpoints reais de `/api/dashboard/**`, que aggregam dados diretamente do MySQL.
- **Indicadores resumidos**: total de peladas, jogadores ativos, rodadas realizadas, total arrecadado, ticket médio, taxa de confirmação e pelada mais popular.
- **Filtros interativos**: seleção de período, limite de rodadas e reset rápido, impactando queries SQL.
- **Gráficos dinâmicos (>=6)**:
  1. Distribuição de posições dos jogadores (barras).
  2. Status dos pagamentos (pizza).
  3. Evolução mensal da arrecadação paga x pendente (linhas).
  4. Confirmados por rodada com intervalo ajustável (barras).
  5. Correlação peladas x estrelas dos jogadores (dispersão).
  6. Perfil radar dos top jogadores (radar).
  7. Cartas de estatística descritiva (média, mediana, moda, variância, desvio padrão) calculadas no backend.
- Páginas adicionais em `frontend/src/app/graficos/**` oferecem visualizações extras inspiradas em exercícios de estatística.

## Arquitetura e tecnologias
- **Backend:** Java 21, Spring Boot 3.5, Spring JDBC, Maven Wrapper, conexão via HikariCP, MySQL 8+.
- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind/PostCSS, Recharts, React Icons.
- **SQL:** `backend/DataBase.sql` (DDL), `insertion.sql` (dados), `sql_*.sql` (views, funções, índices, procedures, triggers, consultas extras).
- **Configurações:** `backend/src/main/resources/application.properties` lê usuário/senha/URL via variáveis (`SPRING_DATASOURCE_*`), permitindo trocar o banco sem recompilar.

## Preparando o banco
1. Criar o schema:
   ```bash
   mysql -u root -p < backend/DataBase.sql
   ```
2. Inserir dados base:
   ```bash
   mysql -u root -p springfut < backend/insertion.sql
   ```
3. Executar os artefatos complementares (índices, funções, procedures, triggers, views):
   ```bash
   mysql -u root -p springfut < backend/sql_funcoes_entrega5.sql
   mysql -u root -p springfut < backend/sql_procedimentos_entrega5.sql
   mysql -u root -p springfut < backend/sql_triggers_entrega5.sql
   mysql -u root -p springfut < backend/sql_visoes.sql
   ```
   *(os demais arquivos `sql_*.sql` também podem ser rodados conforme necessidade da análise)*



## Executando a API
```bash
cd backend
./mvnw spring-boot:run    # http://localhost:8080
./mvnw test               # testes básicos do Spring Boot
./mvnw clean package      # gera JAR em target/
```
- Endpoints sob `/api/**` cobrem autenticação, CRUDs, dashboard, consultas, fila/promoção de jogadores, auditoria e integrações com SQL avançado.
- `CorsConfig` libera `http://localhost:3000`; ajuste para outros domínios quando publicar.

## Executando o frontend
```bash
cd frontend
npm install
npm run dev               # http://localhost:3000
npm run lint              # validação ESLint/Next
npm run build && npm run start
```
- As requisições apontam para `http://localhost:8080/api` 
- Estrutura do App Router:
  - `login` / `register`: autenticação com criação automática de Jogador ao cadastrar Pessoa.
  - `dashboard` e `graficos/**`: análises estatísticas conectadas ao banco.
  - `peladas/**`: criação/edição/listagem, rodadas, fila e inscrição/pagamento integrados.
  - `pessoas`, `perfil`, `perfil/editar`: manutenção de cadastro e execução da procedure de contato.
  - `consultas/**`, `agenda`, `ranking`, `rodadas/[id]/financeiro`: visualização das views e consultas exigidas.
  - `auditoria/pagamentos`: leitura dos logs alimentados pelo trigger de pagamentos.



