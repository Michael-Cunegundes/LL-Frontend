// src/app/models/index.ts
export type TipoPergunta = 'IMAGEM_PARA_TEXTO' | 'TEXTO_PARA_IMAGEM';

export interface OptionDTO {
  texto?: string;
  imagemUrl?: string;
}

export interface QuestaoDTO {
  id: number;
  tipo: TipoPergunta;
  prompt: string[];
  opcoes: OptionDTO[];
  indiceCorreto: number;
}

export interface RespostaQuizDTO {
  perguntaId: number;
  opcaoEscolhida: number | null;
}

export interface ResultadoQuizDTO {
  pontuacao: number;
  mensagem: string;
}

// ✅ Interface para armazenar detalhes da resposta
export interface RespostaDetalhada {
  pergunta: QuestaoDTO;
  opcaoEscolhida: number | null;
  acertou: boolean;
  tempoResposta?: number;
}
