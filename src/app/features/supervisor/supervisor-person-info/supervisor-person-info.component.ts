import { Component, inject, signal, OnInit } from '@angular/core';
import { QRCodeComponent } from 'angularx-qrcode';
import { PageLayoutComponent, PageHeaderComponent } from '../../../shared/layouts';
import {
  CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent,
  AvatarComponent,
} from '../../../shared/ui';
import { AgentService } from '../../../core/services/agent.service';

@Component({
  selector: 'app-supervisor-person-info',
  standalone: true,
  imports: [
    PageLayoutComponent,
    PageHeaderComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardContentComponent,
    AvatarComponent,
    QRCodeComponent,
  ],
  templateUrl: './supervisor-person-info.component.html',

  styleUrl: './supervisor-person-info.component.css',
})
export class SupervisorPersonInfoComponent implements OnInit {
  private agentService = inject(AgentService);

  profile = signal({
    fullName: '',
    supervisorCode: '',
    phone: '',
    region: '',
    manager: '',
    hireDate: '',
  });

  teamAgents = signal<any[]>([]);

  qrData = signal('');

  ngOnInit() {
    this.agentService.getSupervisorProfile().subscribe(data => {
      this.profile.set(data);
      this.qrData.set(JSON.stringify({
        name: data.fullName,
        code: data.supervisorCode,
        phone: data.phone,
        region: data.region,
      }));
    });

    this.agentService.getAgents().subscribe(agents => {
      this.teamAgents.set(agents.slice(0, 3));
    });
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
