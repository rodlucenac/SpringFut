-- Índice para acelerar buscas e verificações por organizador nas peladas
CREATE INDEX idx_vinculo_jogador_papel ON VinculoJogadorPelada (idJogador, papelNaPelada, idPelada);

-- Índice para melhorar filtros e ordenações por data de rodada
CREATE INDEX idx_rodada_data ON Rodada (data);
