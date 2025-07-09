import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../services/toast.service';

export function handleError(
  err: HttpErrorResponse,
  toastService: ToastService
) {
  console.error(err);
  if (err.error.errors && err.error.message.includes('field errors')) {
    for (const [key, message] of Object.entries(err.error.errors)) {
      console.log(`${key}: ${message}`);
      toastService.show(message as string, 'error');
    }
  } else if (err.error && err.error.message) {
    toastService.show(err.error.message, 'error');
  } else {
    toastService.show(err.message, 'error');
  }
}
