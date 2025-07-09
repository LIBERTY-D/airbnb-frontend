import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-navbar-link',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar-link.component.html',
  styleUrl: './navbar-link.component.css',
})
export class NavbarLinkComponent {
  @Input() linkText: string = '';
  @Input() isSmallScreen: boolean = true;
  @Input() goToPage!: (linkText: string) => void;
}
