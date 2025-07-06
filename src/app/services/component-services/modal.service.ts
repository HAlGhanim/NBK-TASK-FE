import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  isOpen = signal(false);
  content = signal<any>(null);

  openConfirm(onConfirm: () => void) {
    this.content.set({ type: 'CONFIRM', onConfirm });
    this.isOpen.set(true);
  }

  openForm(template: any, title: string) {
    this.content.set({ type: 'FORM', formTemplate: template, title });
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
    this.content.set(null);
  }
}
