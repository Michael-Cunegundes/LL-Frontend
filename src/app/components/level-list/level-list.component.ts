import { Component }          from '@angular/core';
import { Router, RouterModule }       from '@angular/router';
import { CommonModule }       from '@angular/common';
import { LevelCardComponent } from '../level-card/level-card.component';

@Component({
  selector: 'level-list',
  standalone: true,
  imports: [CommonModule, LevelCardComponent, RouterModule],
  templateUrl: './level-list.component.html',
  styleUrls: ['./level-list.component.scss']
})
export class LevelListComponent {
  levels = [1,2,3,4,5];

  constructor(private router: Router) {}

  selecionar(level: number) {
    this.router.navigate(['/quiz'], { queryParams: { level } });
  }
}
