import {
  Component,
  inject,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  signal,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersService } from '../../services/api-services/customers.service';
import { TableComponent } from '../../components/tablle/table.component';
import {
  CustomerDTO,
  CreateCustomerDTO,
  UpdateCustomerDTO,
} from '../../interfaces/Customers.interface';
import { ModalService } from '../../services/component-services/modal.service';
import { ToastService } from '../../services/component-services/toast.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, TableComponent, ReactiveFormsModule],
  templateUrl: './customers.component.html',
})
export class CustomersComponent implements AfterViewInit {
  private customersService = inject(CustomersService);
  private modalService = inject(ModalService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  @ViewChild('formTemplate') formTemplate!: TemplateRef<any>;
  @ViewChild(TableComponent) table!: TableComponent<CustomerDTO>;

  customerForm!: FormGroup;
  selectedCustomer: CustomerDTO | null = null;

  ngAfterViewInit(): void {
    this.fetchCustomers();

    this.table.columns.set(['number', 'name', 'dateOfBirth', 'gender']);

    this.table.onAdd.set(() => {
      this.initForm();
      this.selectedCustomer = null;
      this.modalService.openForm(this.formTemplate, 'Add Customer');
    });

    this.table.onEdit.set((item) => {
      this.selectedCustomer = item;
      this.initForm(item);
      this.modalService.openForm(this.formTemplate, 'Update Customer');
    });

    this.table.onDelete.set((item) => {
      this.modalService.openConfirm(() => {
        this.customersService.deleteCustomer(item.number).subscribe({
          next: () => {
            this.toastService.success('Customer deleted');
            this.fetchCustomers();
          },
          error: () => this.toastService.error('Failed to delete customer'),
        });
      });
    });
  }

  initForm(data?: Partial<CustomerDTO>) {
    this.customerForm = this.fb.group({
      name: [data?.name ?? '', Validators.required],
      dateOfBirth: [data?.dateOfBirth ?? '', Validators.required],
      gender: [data?.gender ?? '', Validators.required],
    });
  }

  fetchCustomers() {
    this.customersService.getCustomers().subscribe({
      next: (res) => {
        this.table.data.set(res);
      },
      error: () => this.toastService.error('Failed to load customers'),
    });
  }

  submit() {
    if (this.customerForm.invalid) return;

    const payload = this.customerForm.value;

    if (this.selectedCustomer) {
      this.customersService
        .updateCustomer(
          this.selectedCustomer.number,
          payload as UpdateCustomerDTO
        )
        .subscribe({
          next: () => {
            this.toastService.success('Customer updated');
            this.modalService.close();
            this.fetchCustomers();
          },
          error: () => this.toastService.error('Update failed'),
        });
    } else {
      this.customersService
        .AddCustomer(payload as CreateCustomerDTO)
        .subscribe({
          next: () => {
            this.toastService.success('Customer added');
            this.modalService.close();
            this.fetchCustomers();
          },
          error: () => this.toastService.error('Add failed'),
        });
    }
  }
}
