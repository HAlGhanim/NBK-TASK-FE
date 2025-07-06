import { Component, inject, signal, computed, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../services/component-services/modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  public modalService = inject(ModalService);

  isOpen = computed(() => this.modalService.isOpen());
  content = computed(() => this.modalService.content());

  close() {
    this.modalService.close();
  }
}
