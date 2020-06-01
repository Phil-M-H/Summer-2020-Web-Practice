import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  lobby = 'yayeet';

  setLobby(newLobby) {
    this.lobby = newLobby;
  }

  log() {
    console.log(this.lobby);
  }
}
