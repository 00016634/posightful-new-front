import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { NgClass } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ui-select',
  standalone: true,
  imports: [NgClass],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  templateUrl: './select.component.html',

  styleUrl: './select.component.css',
})
export class SelectComponent implements ControlValueAccessor {
  @Input() className = '';
  @Input() set value(val: string) { this.currentValue = val ?? ''; }

  currentValue = '';
  isDisabled = false;
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  get computedClasses(): string {
    return [
      'flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-input-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
      this.className,
    ].join(' ');
  }

  onSelect(event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    this.currentValue = val;
    this.onChange(val);
  }

  writeValue(value: string) {
    this.currentValue = value ?? '';
  }

  registerOnChange(fn: (value: string) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled;
  }
}
