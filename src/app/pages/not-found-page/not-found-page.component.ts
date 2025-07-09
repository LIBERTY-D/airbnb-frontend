import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NavBarService } from '../../services/navbar.service';

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './not-found-page.component.html',
})
export class NotFoundPageComponent implements OnInit {
  constructor(private router: Router, private navBarService: NavBarService) {}

  goToHomePage() {
    this.router.navigate(['/']);
    this.navBarService.showNavbar();
  }
  ngOnInit(): void {
    this.navBarService.hideNavbar();
  }
}
