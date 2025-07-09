
import { ApiResponse } from '../types/res.generic.type';
import { ToastService } from '../services/toast.service';


export function sucessHandler(res: ApiResponse<any>,  toastService:ToastService) {
  toastService.show(res.message, 'success');
}
