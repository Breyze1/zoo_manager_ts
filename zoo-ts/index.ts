import { Animal } from "./src/animals/Animal";
import { Elephant } from "./src/animals/Elephant";
import { Lion } from "./src/animals/Lion";
import { Nourrisseur } from "./src/services/Nourisseur";
import { ZooRepository } from "./src/services/ZooRepository";

const zoo = new ZooRepository<Animal>();
zoo.add("simba", new Lion("Simba", 5));
zoo.add("dumbo", new Elephant("Dumbo", 10));

const tousLesAnimaux = zoo.getAll();
// Faire crier les animaux
tousLesAnimaux.forEach((animal) => animal.crier());

const nourrisseur = new Nourrisseur();
tousLesAnimaux.forEach((animal) => {
  if ("nourrir" in animal) {
    nourrisseur.nourrir(animal as any);
  }
});
