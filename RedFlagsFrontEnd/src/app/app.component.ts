import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'RedFlagsFrontEnd';
  counter = 0;
  submit(): void {
    console.log('Counter:', this.counter++);
  }
}
