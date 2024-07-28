import { randomUUID } from "crypto";
import { Card } from "./card";

class List {
  public id: string;
  public name: string;
  public cards: Card[] = [];

  public constructor(name: string) {
    this.name = name;
    this.id = randomUUID();
  }

  public setCards(cards: Card[]): this {
    this.cards = cards;
    return this;
  }

  // PATTERN: Prototype
  public cloneWithName(newName: string): List {
    const clonedList = Object.create(Object.getPrototypeOf(this));
    clonedList.id = this.id;
    clonedList.name = newName;
    clonedList.cards = this.cards.map((card) => card.clone());
    return clonedList;
  }
}

export { List };
