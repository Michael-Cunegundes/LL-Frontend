// src/app/models/index.ts
export type TipoPergunta = 'IMAGEM_PARA_TEXTO' | 'TEXTO_PARA_IMAGEM';

export interface OptionDTO {
  texto?: string;      // quando a opção for texto
  imagemUrl?: string;  // quando a opção for imagem
}

// ✅ Renomeado de PerguntaDTO para QuestaoDTO para alinhar com backend
export interface QuestaoDTO {
  id: number;
  tipo: TipoPergunta;
  prompt: string[];       // sempre um array
  opcoes: OptionDTO[];    // lista de opções
  indiceCorreto: number;
}

export interface RespostaQuizDTO {
  perguntaId: number;
  opcaoEscolhida: number | null;
}

// ✅ Corrigido: backend retorna 'pontuacao', não 'acertos'
export interface ResultadoQuizDTO {
  pontuacao: number;  // ← Corrigido
  mensagem: string;
}
