import { Animal } from "./Animal";

export class Elephant extends Animal {
  override crier(): void {
    console.log(`${this.nom} barrit 🐘 !`);
  }
}
