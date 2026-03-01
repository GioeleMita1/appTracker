import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { TodosService, TodoItem } from '../services/todos.service';

/** Palette colori pastello per le card (stile reference) */
const CARD_COLORS = [
  '#fce7f3', // rosa
  '#ede9fe', // lavanda
  '#fef3c7', // giallo/beige
  '#d1fae5', // menta
  '#ffedd5', // pesca
];

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css'],
  animations: [
    trigger('listItem', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-12px)' }),
        animate('0.28s ease', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        animate('0.22s ease', style({ opacity: 0, transform: 'translateX(12px)' })),
      ]),
    ]),
  ],
})
export class TodosComponent implements OnInit {
  items = signal<TodoItem[]>([]);
  showAddForm = signal(false);
  newTitle = signal('');
  newDescription = signal('');
  editingId = signal<string | null>(null);
  editTitle = signal('');
  editDescription = signal('');

  constructor(private todos: TodosService) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.items.set(this.todos.getAll());
  }

  getCardColor(index: number): string {
    return CARD_COLORS[index % CARD_COLORS.length];
  }

  formatTime(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  }

  openAddForm(): void {
    this.showAddForm.set(true);
    this.newTitle.set('');
    this.newDescription.set('');
    this.editingId.set(null);
  }

  closeAddForm(): void {
    this.showAddForm.set(false);
    this.newTitle.set('');
    this.newDescription.set('');
  }

  add(): void {
    const title = this.newTitle().trim();
    if (!title) return;
    this.todos.add(title, this.newDescription().trim() || undefined);
    this.closeAddForm();
    this.refresh();
  }

  toggle(item: TodoItem): void {
    this.todos.toggle(item.id);
    this.refresh();
  }

  startEdit(item: TodoItem): void {
    this.editingId.set(item.id);
    this.editTitle.set(item.title);
    this.editDescription.set(item.description ?? '');
    this.showAddForm.set(false);
  }

  saveEdit(): void {
    const id = this.editingId();
    if (!id) return;
    const title = this.editTitle().trim();
    if (title) this.todos.update(id, { title, description: this.editDescription().trim() || undefined });
    this.editingId.set(null);
    this.refresh();
  }

  cancelEdit(): void {
    this.editingId.set(null);
  }

  remove(item: TodoItem): void {
    if (!confirm('Sei sicuro di voler eliminare questa attività?')) return;
    this.todos.remove(item.id);
    this.refresh();
  }
}
