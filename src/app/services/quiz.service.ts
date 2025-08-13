// src/app/services/quiz.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  PerguntaDTO,
  RespostaQuizDTO,
  ResultadoQuizDTO
} from '../models';

@Injectable({ providedIn: 'root' })
export class QuizService {
  // usa o proxy definido em proxy.conf.json
  private baseUrl = '/api/quiz';

  constructor(private http: HttpClient) {}

  getPerguntas(): Observable<PerguntaDTO[]> {
    return this.http.get<PerguntaDTO[]>(`${this.baseUrl}/perguntas`);
  }

  submitRespostas(respostas: RespostaQuizDTO[]): Observable<ResultadoQuizDTO> {
    return this.http.post<ResultadoQuizDTO>(
      `${this.baseUrl}/respostas`,
      respostas
    );
  }
}
