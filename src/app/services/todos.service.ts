import { Injectable } from '@angular/core';

export interface TodoItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  order: number;
}

const STORAGE_KEY = 'ph_todos';

@Injectable({ providedIn: 'root' })
export class TodosService {
  private items: TodoItem[] = [];
  private nextOrder = 0;

  constructor() {
    this.load();
  }

  private load(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.items = JSON.parse(raw);
        this.nextOrder = Math.max(0, ...this.items.map((t) => t.order)) + 1;
      }
    } catch {
      this.items = [];
    }
  }

  private save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
  }

  getAll(): TodoItem[] {
    return [...this.items].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return a.order - b.order;
    });
  }

  add(title: string, description?: string): TodoItem {
    const id = `todo_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const item: TodoItem = {
      id,
      title: title.trim(),
      description: description?.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      order: this.nextOrder++,
    };
    this.items.push(item);
    this.save();
    return item;
  }

  update(id: string, updates: Partial<Pick<TodoItem, 'title' | 'description' | 'completed'>>): TodoItem | undefined {
    const item = this.items.find((t) => t.id === id);
    if (!item) return undefined;
    if (updates.title !== undefined) item.title = updates.title.trim();
    if (updates.description !== undefined) item.description = updates.description?.trim();
    if (updates.completed !== undefined) item.completed = updates.completed;
    this.save();
    return item;
  }

  toggle(id: string): TodoItem | undefined {
    const item = this.items.find((t) => t.id === id);
    if (!item) return undefined;
    item.completed = !item.completed;
    this.save();
    return item;
  }

  remove(id: string): boolean {
    const idx = this.items.findIndex((t) => t.id === id);
    if (idx === -1) return false;
    this.items.splice(idx, 1);
    this.save();
    return true;
  }
}
