import { Nourrissable } from "../interfaces/Nourrissable";

export class Nourrisseur {
  nourrir(animal: Nourrissable): void {
    animal.nourrir();
  }
}
