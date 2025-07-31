import { Animal } from "../animals/Animal";

export class ZooRepository<T extends Animal> {
  private animaux: Map<string, T> = new Map();

  add(nom: string, animal: T): void {
    this.animaux.set(nom, animal);
  }

  get(nom: string): T | undefined {
    return this.animaux.get(nom);
  }

  getAll(): T[] {
    return Array.from(this.animaux.values());
  }

  remove(nom: string): boolean {
    return this.animaux.delete(nom);
  }
}
