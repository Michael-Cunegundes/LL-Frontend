// src/app/services/quiz.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  QuestaoDTO,
  RespostaQuizDTO,
  ResultadoQuizDTO
} from '../models';

@Injectable({ providedIn: 'root' })
export class QuizService {
  private baseUrl = '/api/quiz';

  constructor(private http: HttpClient) {}

  // ✅ Corrigido: usar endpoint por nível
  getQuestoesPorNivel(level: number): Observable<QuestaoDTO[]> {
    return this.http.get<QuestaoDTO[]>(`${this.baseUrl}/levels/${level}/questions`);
  }

  // ✅ Manter endpoint geral para debug
  getTodasPerguntas(): Observable<QuestaoDTO[]> {
    return this.http.get<QuestaoDTO[]>(`${this.baseUrl}/perguntas`);
  }

  submitRespostas(respostas: RespostaQuizDTO[]): Observable<ResultadoQuizDTO> {
    return this.http.post<ResultadoQuizDTO>(
      `${this.baseUrl}/respostas`,
      respostas
    );
  }
}
