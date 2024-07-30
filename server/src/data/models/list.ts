import { randomUUID } from 'crypto';

import type { Card } from './card';

class List {
  public id: string;

  public name: string;

  public cards: Card[] = [];

  public constructor(name: string) {
    this.name = name;
    this.id = randomUUID();
  }

  public setCards(cards: Card[]): List {
    this.cards = cards;

    return this;
  }
}
export { List };
