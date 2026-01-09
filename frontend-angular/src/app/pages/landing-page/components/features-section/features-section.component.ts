import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-features-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features-section.component.html',
  styleUrls: ['./features-section.component.scss'],
})
export class FeaturesSectionComponent {
  features = [
    {
      icon: '⚡',
      title: 'Rápido y Simple',
      description:
        'Crea encuestas en segundos sin complicaciones. Interfaz intuitiva y fácil de usar para todos.',
    },
    {
      icon: '🔗',
      title: 'Comparte Fácilmente',
      description:
        'Comparte tus encuestas mediante un enlace único. Copia y pega en redes sociales o mensajes.',
    },
    {
      icon: '📊',
      title: 'Resultados en Tiempo Real',
      description:
        'Visualiza los votos en gráficos actualizados al instante. Analiza el comportamiento de tus encuestas.',
    },
    {
      icon: '📱',
      title: 'Diseño Responsivo',
      description:
        'Funciona perfectamente en móviles, tablets y ordenadores. La mejor experiencia en cualquier dispositivo.',
    },
  ];
}

