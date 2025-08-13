export type TipoPergunta = 'IMAGEM_PARA_TEXTO' | 'TEXTO_PARA_IMAGEM';

export interface OptionDTO {
  texto?: string;      // quando a opção for texto
  imagemUrl?: string;  // quando a opção for imagem
}

export interface PerguntaDTO {
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

export interface ResultadoQuizDTO {
  acertos: number;
  mensagem: string;
}
