import { NgModule } from '@angular/core';
import { FlatpickrDirective } from '../app/directives/flatPicker.direct';

@NgModule({
  declarations: [FlatpickrDirective],
  exports: [FlatpickrDirective],
})
export class SharedModule {}
