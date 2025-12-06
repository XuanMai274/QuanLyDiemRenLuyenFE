import { Component, OnInit } from '@angular/core';
import { CriteriaTypeDTO } from '../../../models/criteriaType.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CriteriaService } from '../../../service/criteriaService';
import { CriteriaTypeService } from '../../../service/criteriaTypeService';
import { CriteriaDTO } from '../../../models/criteria.model';
import { Form } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-criteria',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './criteria.component.html',
  styleUrls: ['./criteria.component.css']
})
export class CriteriaComponent implements OnInit {
  criteriaTypes: CriteriaTypeDTO[] = [];
  selectedType!: CriteriaTypeDTO | null;
  criteriaForm!: FormGroup;
  typeForm!: FormGroup;
  showCriteriaForm = false;
  showTypeForm = false;
  editingCriteriaId: number | null = null;
  editingTypeId: number | null = null;

  constructor(
    private criteriaService: CriteriaService,
    private criteriaTypeService: CriteriaTypeService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loadCriteriaTypes();
    this.initForms();
  }
  // INIT FORMS
  initForms() {
    // Form Tiêu chí
    this.criteriaForm = this.fb.group({
      criteriaName: ['', Validators.required],
      criteriaDetail: ['', Validators.required],
      maxScore: [0, [Validators.required, Validators.min(1)]],
      criteriaTypeId: [null, Validators.required] // Thêm trường loại tiêu chí
    });
    console.log("Tiêu chí", this.criteriaForm);
    // Form Loại tiêu chí
    this.typeForm = this.fb.group({
      criteriaTypeName: ['', Validators.required],
      maxScore: [0, [Validators.required, Validators.min(1)]],
      isActive: [true]
    });
    console.log("Loại tiêu chí", this.typeForm);
  }

  // ======================================================
  // LOAD DATA
  // ======================================================
  loadCriteriaTypes() {
    this.criteriaTypeService.getAllCriteriaTypes().subscribe({
      next: (data) => {
        this.criteriaTypes = data;
        console.log('Loaded types', data);
      },
      error: (err) => console.error('Load types failed', err)
    });
  }

  loadCriteriaByType(typeId: number) {
    this.criteriaService.getAllCriteriaByCriteriaType(typeId).subscribe({
      next: (data) => {
        const type = this.criteriaTypes.find(t => t.criteriaTypeId === typeId);
        if (type) type.criteriaEntityList = data || [];
        this.selectedType = type || null;
      },
      error: (err) => console.error('Load criteria failed', err)
    });
  }

  // ======================================================
  // SELECT TYPE
  // ======================================================
  selectType(type: CriteriaTypeDTO) {
    this.selectedType = type;
    this.loadCriteriaByType(type.criteriaTypeId!);
  }

  // ======================================================
  // CRUD LOẠI TIÊU CHÍ
  // ======================================================

  openAddTypeForm() {
    this.showTypeForm = true;
    this.editingTypeId = null;
    this.typeForm.reset({ isActive: true });
  }

  openEditTypeForm(type: CriteriaTypeDTO) {
    this.showTypeForm = true;
    this.editingTypeId = type.criteriaTypeId;
    this.typeForm.patchValue(type);
  }

  saveType() {
    const value = this.typeForm.value;
    value.criteriaTypeId = this.editingTypeId;
    console.log('Saving type', value);
    if (this.editingTypeId) {
      //  UPDATE
      this.criteriaTypeService.updateCriteriaType(value)
        .subscribe({
          next: () => this.loadCriteriaTypes(),
          error: err => console.error('Update type failed', err)
        });
    } else {
      // CREATE
      this.criteriaTypeService.createCriteriaType(value)
        .subscribe({
          next: () => this.loadCriteriaTypes(),
          error: err => console.error('Create type failed', err)
        });
    }

    this.showTypeForm = false;
  }

  cancelTypeForm() {
    this.showTypeForm = false;
    this.editingTypeId = null;
    this.typeForm.reset();
  }

  // ======================================================
  // CRUD TIÊU CHÍ
  // ======================================================
  openAddCriteriaForm() {
    this.showCriteriaForm = true;
    this.editingCriteriaId = null;
    this.criteriaForm.reset();
  }

  openEditCriteriaForm(criteria: CriteriaDTO) {
    this.showCriteriaForm = true;
    this.editingCriteriaId = criteria.criteriaId!;
    this.criteriaForm.patchValue({
      ...criteria,
      criteriaTypeId: criteria.criteriaTypeEntity?.criteriaTypeId // gán id loại tiêu chí
    });
  }

  saveCriteria() {
    if (!this.selectedType) return;

    const value = this.criteriaForm.value;
    if (this.editingCriteriaId) {
      value.criteriaId = this.editingCriteriaId;
      const selectedType = this.criteriaTypes.find(t => t.criteriaTypeId === value.criteriaTypeId);
      const payload = {
        ...value,
        criteriaTypeEntity: selectedType
      };
      console.log("id", this.editingCriteriaId, "và ", payload.criteriaId);
      console.log('Saving criteria', payload);
      // UPDATE
      this.criteriaService.updateCriteria(payload)
        .subscribe({
          next: () => this.loadCriteriaByType(this.selectedType!.criteriaTypeId!),
          error: err => console.error('Update failed', err)
        });

    } else {
      // CREATE
      const payload = {
        ...value,
        criteriaTypeEntity: this.selectedType
      };
      console.log('Creating criteria with payload', payload);
      this.criteriaService.createCriteria(payload)
        .subscribe({
          next: () => this.loadCriteriaByType(this.selectedType!.criteriaTypeId!),
          error: err => console.error('Create failed', err)
        });
    }

    this.showCriteriaForm = false;
  }

  cancelCriteriaForm() {
    this.showCriteriaForm = false;
    this.editingCriteriaId = null;
    this.criteriaForm.reset();
  }

  // ======================================================
  // ORDER
  // ======================================================
  moveCriteriaUp(index: number) {
    if (!this.selectedType || index <= 0) return;
    const arr = this.selectedType.criteriaEntityList!;
    [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
  }

  moveCriteriaDown(index: number) {
    if (!this.selectedType) return;
    const arr = this.selectedType.criteriaEntityList!;
    if (index >= arr.length - 1) return;
    [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
  }
  totalAssignedPoints(type: CriteriaTypeDTO) {
    return (type.criteriaEntityList || []).reduce((sum, c) => sum + (c.maxScore || 0), 0);
  }
}
