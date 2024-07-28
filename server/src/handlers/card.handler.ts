import type { Socket } from "socket.io";

import { CardEvent } from "../common/enums/enums";
import { Card } from "../data/models/card";
import { SocketHandler } from "./socket.handler";

class CardHandler extends SocketHandler {
  public handleConnection(socket: Socket): void {
    socket.on(CardEvent.CREATE, this.createCard.bind(this));
    socket.on(CardEvent.REORDER, this.reorderCards.bind(this));
    socket.on(CardEvent.RENAME, this.renameCard.bind(this));
    socket.on(CardEvent.CHANGE_DESCRIPTION, this.changeDescription.bind(this));
    socket.on(CardEvent.DUPLICATE, this.duplicateCard.bind(this));
    socket.on(CardEvent.DELETE, this.deleteCard.bind(this));
  }

  public createCard(listId: string, cardName: string): void {
    const newCard = new Card(cardName, "");
    const lists = this.db.getData();

    const updatedLists = lists.map((list) =>
      list.id === listId ? list.setCards(list.cards.concat(newCard)) : list
    );

    this.db.setData(updatedLists);
    this.updateLists();
  }

  private reorderCards({
    sourceIndex,
    destinationIndex,
    sourceListId,
    destinationListId,
  }: {
    sourceIndex: number;
    destinationIndex: number;
    sourceListId: string;
    destinationListId: string;
  }): void {
    const lists = this.db.getData();

    const reordered = this.reorderService.reorderCards({
      lists,
      sourceIndex,
      destinationIndex,
      sourceListId,
      destinationListId,
    });

    this.db.setData(reordered);
    this.updateLists();
  }

  public renameCard(listId: string, cardId: string, newName: string): void {
    const lists = this.db.getData();

    const updatedLists = lists.map((list) =>
      list.id === listId
        ? list.setCards(
            list.cards.map((card) =>
              card.id === cardId ? card.cloneWithName(newName) : card
            )
          )
        : list
    );

    this.db.setData(updatedLists);
    this.updateLists();
  }

  public changeDescription(
    listId: string,
    cardId: string,
    newDescription: string
  ): void {
    const lists = this.db.getData();

    const updatedLists = lists.map((list) =>
      list.id === listId
        ? list.setCards(
            list.cards.map((card) =>
              card.id === cardId
                ? card.cloneWithDescription(newDescription)
                : card
            )
          )
        : list
    );

    this.db.setData(updatedLists);
    this.updateLists();
  }

  public duplicateCard(listId: string, cardId: string): void {
    const lists = this.db.getData();

    const updatedLists = lists.map((list) =>
      list.id === listId
        ? list.setCards(
            list.cards.concat(
              list.cards
                .filter((card) => card.id === cardId)
                .map((card) => card.clone())
            )
          )
        : list
    );

    this.db.setData(updatedLists);
    this.updateLists();
  }

  public deleteCard(listId: string, cardId: string): void {
    const lists = this.db.getData();

    const updatedLists = lists.map((list) =>
      list.id === listId
        ? list.setCards(list.cards.filter((card) => card.id !== cardId))
        : list
    );

    this.db.setData(updatedLists);
    this.updateLists();
  }
}

export { CardHandler };
