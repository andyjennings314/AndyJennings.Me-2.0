import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [FontAwesomeModule, RouterLink, NgClass],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  faLinkedin = faLinkedin;
  faGithub = faGithub;
  faEnvelope = faEnvelope;
  mobileExpanded: boolean = false;
}
