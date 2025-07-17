import { Component }        from '@angular/core';
import { CommonModule }     from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ResultadoQuizDTO } from '../../models';

@Component({
  selector: 'quiz-result',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule    // ← necessário para usar router.navigate() no template
  ],
  templateUrl: './quiz-result.html'
})
export class QuizResultComponent {
  resultado!: ResultadoQuizDTO;

  constructor(
    public router: Router   // ← public, para o template conseguir acessar
  ) {
    const nav = this.router.getCurrentNavigation();
    this.resultado = nav?.extras.state?.['resultado'];
  }
}
