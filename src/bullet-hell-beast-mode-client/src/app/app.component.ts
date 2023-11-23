import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { HttpClient, HttpClientModule } from "@angular/common/http";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss"
})
export class AppComponent implements OnInit {
  title = "bullet-hell-beast-mode";
  response?: Response;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Response>("https://localhost:7263/test").subscribe((response) => (this.response = response));
  }
}

class Response {
  text?: string;
}
