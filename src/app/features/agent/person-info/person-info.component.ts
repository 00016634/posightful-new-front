import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QRCodeComponent } from 'angularx-qrcode';
import { PageLayoutComponent } from '../../../shared/layouts/page-layout.component';
import {
  CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent,
  ButtonComponent, AvatarComponent, SeparatorComponent,
} from '../../../shared/ui';
import { AgentService } from '../../../core/services/agent.service';

@Component({
  selector: 'app-person-info',
  standalone: true,
  imports: [
    QRCodeComponent,
    PageLayoutComponent,
    CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent,
    ButtonComponent, AvatarComponent, SeparatorComponent,
  ],
  templateUrl: './person-info.component.html',

  styleUrl: './person-info.component.css',
})
export class PersonInfoComponent implements OnInit {
  router = inject(Router);
  private agentService = inject(AgentService);

  profile = signal({
    fullName: '',
    agentCode: '',
    phone: '',
    region: '',
    supervisor: '',
    hireDate: '',
  });

  ngOnInit() {
    this.agentService.getAgentProfile().subscribe(data => {
      if (data) this.profile.set(data);
    });
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('');
  }
}
