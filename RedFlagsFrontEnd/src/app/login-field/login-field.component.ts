import {Component, Input, OnInit} from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {HttpClient} from '@angular/common/http';
import urlConfig from '../../assets/urlConfig.json';

const path: string = urlConfig.protocol + urlConfig.domain;

@Component({
  selector: 'app-login-field',
  templateUrl: './login-field.component.html',
  styleUrls: ['./login-field.component.css']
})
export class LoginFieldComponent implements OnInit {
  @Input() username: string;
  @Input() lobbyname: string;
  @Input() lobbypassword: string;
  @Input() lobby: string;
  @Input() setLobby;
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }
  submit(): void {

    console.log('Submitting:');
    console.log('Username|', this.username);
    console.log('lobbyname|', this.lobbyname);
    console.log('Password|', this.lobbypassword);
    const message = {
      username: this.username,
      lobbyname: this.lobbyname,
      password: this.lobbypassword
    };
    console.log('Lobby:', this.lobby);
    this.setLobby('new lobby name heh');
    this.http.post(path, message).subscribe(data => {
      console.log(data);
    });

  }
}
