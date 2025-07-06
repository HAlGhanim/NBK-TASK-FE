import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  signal,
  WritableSignal,
  Signal,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
})
export class TableComponent<T extends Record<string, any>> {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  data: WritableSignal<T[]> = signal([]);
  columns: WritableSignal<(keyof T)[]> = signal([]);
  pageSize: WritableSignal<number> = signal(5);

  onAdd: WritableSignal<() => void> = signal(() => {});
  onEdit: WritableSignal<(item: T) => void> = signal(() => {});
  onDelete: WritableSignal<(item: T) => void> = signal(() => {});

  currentPage = signal(1);
  searchTerm = signal('');
  sortColumn = signal<keyof T | null>(null);
  sortDirection = signal<'asc' | 'desc'>('asc');

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      this.currentPage.set(+params.get('page')! || 1);
      this.pageSize.set(+params.get('size')! || 5);
      this.searchTerm.set(params.get('search') || '');
      this.sortColumn.set((params.get('sort') as keyof T) || null);
      this.sortDirection.set(
        (params.get('direction') as 'asc' | 'desc') || 'asc'
      );
    });
  }

  readonly filteredData = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.data().filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(term)
      )
    );
  });

  readonly sortedData = computed(() => {
    const data = [...this.filteredData()];
    const column = this.sortColumn();
    const direction = this.sortDirection();
    if (!column) return data;

    return data.sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];

      const isNumeric =
        typeof aValue === 'number' && typeof bValue === 'number';

      if (isNumeric) {
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return direction === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  });

  get paginatedData() {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.sortedData().slice(start, start + this.pageSize());
  }

  readonly paginationArray = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

  readonly totalPages = computed(() =>
    Math.ceil(this.filteredData().length / this.pageSize())
  );

  handleSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
    this.currentPage.set(1);
    this.updateQueryParams();
  }

  toggleSort(col: keyof T) {
    const direction =
      this.sortColumn() === col && this.sortDirection() === 'asc'
        ? 'desc'
        : 'asc';
    this.sortColumn.set(col);
    this.sortDirection.set(direction);
    this.updateQueryParams();
  }

  goToPage(page: number) {
    this.currentPage.set(page);
    this.updateQueryParams();
  }

  updateQueryParams() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.currentPage(),
        size: this.pageSize(),
        search: this.searchTerm() || null,
        sort: this.sortColumn() || null,
        direction: this.sortDirection(),
      },
      queryParamsHandling: 'merge',
    });
  }

  exportToCSV() {
    const rows = [
      this.columns(),
      ...this.filteredData().map((row) =>
        this.columns().map((col) => String(row[col] ?? ''))
      ),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  changePageSize(event: Event) {
    const value = +(event.target as HTMLSelectElement).value;
    this.pageSize.set(value);
    this.currentPage.set(1);
    this.updateQueryParams();
  }
}
