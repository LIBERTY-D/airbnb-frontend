import {
  Directive,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import flatpickr from 'flatpickr';
import { Instance as FlatpickrInstance } from 'flatpickr/dist/types/instance';

@Directive({
  selector: '[appFlatpickr]',
})
export class FlatpickrDirective implements OnChanges {
  @Input() config: flatpickr.Options.Options = {};
  @Output() dateChange = new EventEmitter<Date[]>();
  private fpInstance: FlatpickrInstance | null = null;

  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['config'] && this.config) {
      if (this.fpInstance) {
        this.fpInstance.destroy();
      }
      this.fpInstance = flatpickr(this.el.nativeElement, {
        ...this.config,
        onChange: (
          selectedDates: Date[],
          dateStr: string,
          instance: FlatpickrInstance
        ) => {
          this.dateChange.emit(selectedDates);
        },
      });
    }
  }
}
