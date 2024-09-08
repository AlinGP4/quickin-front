import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() icon: string = "";
  @Input() value: string = "";
  @Input() active: boolean = false;
  @Output() OnClick = new EventEmitter<boolean>();

  handlerClick() {
    this.OnClick.emit(true);
  }
}
