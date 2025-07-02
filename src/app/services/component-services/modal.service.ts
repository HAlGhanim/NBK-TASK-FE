import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  isOpen = signal(false);
  content = signal<null | string>(null);

  open(content: string) {
    this.content.set(content);
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
    this.content.set(null);
  }
}
