export class Animal {
  constructor(public nom: string, public age: number) {}

  crier(): void {
    console.log(`${this.nom} pousse un cri`);
  }
}
