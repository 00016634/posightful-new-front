import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { NgClass } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ui-switch',
  standalone: true,
  imports: [NgClass],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchComponent),
      multi: true,
    },
  ],
  templateUrl: './switch.component.html',

  styleUrl: './switch.component.css',
})
export class SwitchComponent implements ControlValueAccessor {
  @Input() className = '';
  @Input() set checked(val: boolean) { this._checked = !!val; }
  get checked(): boolean { return this._checked; }
  @Output() checkedChange = new EventEmitter<boolean>();

  private _checked = false;
  isDisabled = false;
  onChange: (value: boolean) => void = () => {};
  onTouched: () => void = () => {};

  toggle() {
    this._checked = !this._checked;
    this.onChange(this._checked);
    this.checkedChange.emit(this._checked);
    this.onTouched();
  }

  writeValue(value: boolean) {
    this._checked = !!value;
  }

  registerOnChange(fn: (value: boolean) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled;
  }
}
