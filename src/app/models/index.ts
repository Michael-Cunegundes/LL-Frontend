// src/app/models/index.ts

export type TipoPergunta = 'IMAGEM_PARA_TEXTO' | 'TEXTO_PARA_IMAGEM';

export interface OptionDTO {
  texto?: string;      // usado quando a opção é texto
  imagemUrl?: string;  // usado quando a opção é imagem
}

export interface PerguntaDTO {
  id: number;
  tipo: TipoPergunta;
  prompt: string[];       // agora é um array
  opcoes: OptionDTO[];
  indiceCorreto: number;
}

export interface RespostaQuizDTO {
  perguntaId: number;
  opcaoEscolhida: number | null;
}

export interface ResultadoQuizDTO {
  acertos: number;
  mensagem: string;
}
