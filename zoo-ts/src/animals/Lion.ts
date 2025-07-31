import { Animal } from "./Animal";
export class Lion extends Animal {
  override crier(): void {
    console.log(`${this.nom} rugit 🦁 !`);
  }
}
