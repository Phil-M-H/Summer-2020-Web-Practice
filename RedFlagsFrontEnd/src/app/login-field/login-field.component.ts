import {Component, OnInit} from '@angular/core';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-login-field',
  templateUrl: './login-field.component.html',
  styleUrls: ['./login-field.component.css']
})
export class LoginFieldComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  submit(event: InputEvent): void {
    console.log('Event:', event);
  }
}
