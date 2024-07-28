import { randomUUID } from "crypto";

class Card {
  public id: string;
  public name: string;
  public description: string;
  public createdAt: Date;

  public constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
    this.createdAt = new Date();
    this.id = randomUUID();
  }

  // PATTERN:Prototype
  public clone(): Card {
    const clonedCard = Object.create(Object.getPrototypeOf(this));
    clonedCard.id = randomUUID();
    clonedCard.name = this.name;
    clonedCard.description = this.description;
    clonedCard.createdAt = new Date(this.createdAt);
    return clonedCard;
  }

  // PATTERN:Prototype
  public cloneWithName(newName: string): Card {
    const clonedCard = Object.create(Object.getPrototypeOf(this));
    clonedCard.id = this.id;
    clonedCard.name = newName;
    clonedCard.description = this.description;
    clonedCard.createdAt = new Date(this.createdAt);
    return clonedCard;
  }

  // PATTERN:Prototype
  public cloneWithDescription(newDescription: string): Card {
    const clonedCard = Object.create(Object.getPrototypeOf(this));
    clonedCard.id = this.id;
    clonedCard.name = this.name;
    clonedCard.description = newDescription;
    clonedCard.createdAt = new Date(this.createdAt);
    return clonedCard;
  }
}

export { Card };
