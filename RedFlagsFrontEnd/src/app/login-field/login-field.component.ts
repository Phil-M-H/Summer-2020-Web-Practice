import {Component, Input, OnInit} from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {HttpClient} from '@angular/common/http';


@Component({
  selector: 'app-login-field',
  templateUrl: './login-field.component.html',
  styleUrls: ['./login-field.component.css']
})
export class LoginFieldComponent implements OnInit {
  @Input() username: string;
  @Input() lobbyname: string;
  @Input() lobbypassword: string;
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }
  submit(): void {
    const path = 'http://localhost:3030/api/lobby';
    console.log('Submitting:');
    console.log('Username|', this.username);
    console.log('lobbyname|', this.lobbyname);
    console.log('Password|', this.lobbypassword);
    const message = {
      username: this.username,
      lobbyname: this.lobbyname,
      password: this.lobbypassword
    };
    this.http.post(path, message).subscribe(data => {
      console.log(data);
    });

  }
}
