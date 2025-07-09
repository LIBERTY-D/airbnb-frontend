import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavBarService } from '../../services/navbar.service';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.css',
})
export class AboutPageComponent implements OnInit {
  constructor(private router: Router, private navBarService: NavBarService) {}

  goToHomePage() {
    this.router.navigate(['/']);
    this.navBarService.showNavbar();
  }

  ngOnInit(): void {
    this.navBarService.hideNavbar();
  }
}
