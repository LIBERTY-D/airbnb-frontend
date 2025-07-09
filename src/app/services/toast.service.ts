import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Toast } from '../types';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();
  private counter = 0;

  show(message: string, type: 'success' | 'error', duration = 3000) {
    const id = ++this.counter;
    const toast: Toast = { id, message, type, duration };
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([toast, ...currentToasts]);

    setTimeout(() => {
      this.remove(id);
    }, duration);
  }

  remove(id: number) {
    const filtered = this.toastsSubject.value.filter((t) => t.id !== id);
    this.toastsSubject.next(filtered);
  }
}
