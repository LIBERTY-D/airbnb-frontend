import { Component, OnInit } from '@angular/core';
import { NavBarService } from '../../services/navbar.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cancellation-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cancellation-page.component.html',
  styleUrl: './cancellation-page.component.css',
})
export class CancellationPageComponent implements OnInit {
  constructor(private navBarService: NavBarService) {}

  ngOnInit(): void {
    this.navBarService.hideNavbar();
  }
}
