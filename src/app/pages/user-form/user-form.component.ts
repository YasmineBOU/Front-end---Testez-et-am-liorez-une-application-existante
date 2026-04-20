import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../shared/material.module';

interface FormField {
  name: string;
  label: string;
  type: string; // ex: 'text', 'email', 'password', 'select', etc.
  validators?: any[];
  options?: { key: string, value: string }[]; // pour les selects
  hidden?: boolean; // pour masquer certains champs si besoin
}

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})

export class UserFormComponent implements OnInit, OnChanges {
  @Input() initialData: any = {};
  @Input() fields: FormField[] = [];
  @Input() submitLabel = 'Submit';
  @Input() resetLabel = 'Reset';
  @Input() showResetButton = true;
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formReset = new EventEmitter<void>();

  userForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

/**
 * Initialize the form with the given fields and initial data.
 * The form is constructed by iterating over the given fields and
 * setting the initial value of each field to the corresponding value
 * in the initial data object, or an empty string if no value
 * is provided. The validators for each field are also set
 * to the corresponding value in the field object, or an empty
 * array if no validators are provided.
 */
  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.userForm) {
      return;
    }

    if (changes['initialData'] && this.initialData) {
      this.userForm.patchValue(this.initialData);
    }

    if (changes['fields'] && !changes['fields'].firstChange) {
      this.buildForm();
    }
  }

  private buildForm(): void {
    const formControlsConfig: { [key: string]: any } = {};

    this.fields.forEach(field => {
      formControlsConfig[field.name] = [
        this.initialData[field.name] ?? '',
        field.validators || []
      ];
    });

    this.userForm = this.fb.group(formControlsConfig);
  }

/**
 * Returns the form control with the given name, or null if
 * no control with that name exists.
 *
 * @param name the name of the control to retrieve
 * @returns the form control with the given name, or null if
 * no control with that name exists
 */
  getControl(name: string): AbstractControl | null {
    return this.userForm.get(name);
  }

/**
 * Submits the form and emits the form data to the
 * formSubmit output if the form is valid. If the form
 * is invalid, marks all form controls as touched.
 */
  onSubmit(): void {
    if (this.userForm.valid) {
      this.formSubmit.emit(this.userForm.value);
    } else {
      this.userForm.markAllAsTouched();
    }
  }

/**
 * Resets the form by calling the reset method on the underlying form group.
 * This will clear all values from the form and also clear any validation errors.
 */
  onReset(): void {
    this.userForm.reset();
    this.formReset.emit();
  }
}
