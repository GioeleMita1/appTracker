import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DiaryService, DiaryEntry } from '../services/diary.service';

@Component({
  selector: 'app-diary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.css'],
})
export class DiaryComponent implements OnInit {
  entries = signal<DiaryEntry[]>([]);
  selectedId = signal<string | null>(null);
  isCreating = signal(false);
  editTitle = signal('');
  editContent = signal('');

  constructor(private diary: DiaryService) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.entries.set(this.diary.getAll());
  }

  getSelected(): DiaryEntry | undefined {
    const id = this.selectedId();
    return id ? this.diary.get(id) : undefined;
  }

  openCreate(): void {
    this.editTitle.set('');
    this.editContent.set('');
    this.isCreating.set(true);
    this.selectedId.set(null);
  }

  openEdit(entry: DiaryEntry): void {
    this.selectedId.set(entry.id);
    this.isCreating.set(false);
    this.editTitle.set(entry.title);
    this.editContent.set(entry.content);
  }

  save(): void {
    if (this.isCreating()) {
      const title = this.editTitle().trim() || 'Senza titolo';
      const content = this.editContent().trim();
      this.diary.add(title, content);
      this.isCreating.set(false);
    } else {
      const id = this.selectedId();
      if (id) {
        this.diary.update(id, this.editTitle().trim(), this.editContent().trim());
        this.selectedId.set(null);
      }
    }
    this.refresh();
  }

  deleteEntry(entry: DiaryEntry): void {
    if (!confirm('Sei sicuro di voler eliminare questa nota? L\'operazione non può essere annullata.')) return;
    this.diary.remove(entry.id);
    if (this.selectedId() === entry.id) this.selectedId.set(null);
    this.refresh();
  }

  cancel(): void {
    this.selectedId.set(null);
    this.isCreating.set(false);
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  preview(content: string, maxLen = 120): string {
    const t = content.trim();
    if (t.length <= maxLen) return t;
    return t.slice(0, maxLen) + '…';
  }
}
