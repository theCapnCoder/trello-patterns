import type { Socket } from "socket.io";

import { CardEvent } from "../common/enums/enums";
import { Card } from "../data/models/card";
import { SocketHandler } from "./socket.handler";
import { Logger } from "../logging/logger";
import { FileLogger } from "../logging/fileLogger";
import { ConsoleErrorLogger } from "../logging/consoleErrorLogger";

// PATTERN:Observer - Logger acts as the Publisher
const logger = new Logger();
// PATTERN:Observer - FileLogger acts as a Subscriber
logger.subscribe(new FileLogger());
// PATTERN:Observer - ConsoleErrorLogger acts as a Subscriber
logger.subscribe(new ConsoleErrorLogger());

class CardHandler extends SocketHandler {
  public handleConnection(socket: Socket): void {
    socket.on(CardEvent.CREATE, this.createCard.bind(this));
    socket.on(CardEvent.REORDER, this.reorderCards.bind(this));
    socket.on(CardEvent.RENAME, this.renameCard.bind(this));
    socket.on(CardEvent.CHANGE_DESCRIPTION, this.changeDescription.bind(this));
    socket.on(CardEvent.DUPLICATE, this.duplicateCard.bind(this));
    socket.on(CardEvent.DELETE, this.deleteCard.bind(this));
  }

  private getListName(listId: string): string {
    const list = this.db.getData().find((list) => list.id === listId);
    return list?.name || "Unknown List";
  }

  private getCardName(listId: string, cardId: string): string {
    const list = this.db.getData().find((list) => list.id === listId);
    const card = list?.cards.find((card) => card.id === cardId);
    return card?.name || "Unknown Card";
  }

  public createCard(listId: string, cardName: string): void {
    try {
      const newCard = new Card(cardName, "");
      const lists = this.db.getData();

      const updatedLists = lists.map((list) =>
        list.id === listId ? list.setCards(list.cards.concat(newCard)) : list
      );

      this.db.setData(updatedLists);
      this.updateLists();

      const listName = this.getListName(listId);
      logger.log("info", `Card created: ${newCard.name} in list ${listName}`);
    } catch (error) {
      logger.log(
        "error",
        `Error creating card ${cardName} in list ${listId}: ${error.message}`
      );
    }
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
    try {
      const lists = this.db.getData();
      const sourceListName = this.getListName(sourceListId);
      const destinationListName = this.getListName(destinationListId);

      const reordered = this.reorderService.reorderCards({
        lists,
        sourceIndex,
        destinationIndex,
        sourceListId,
        destinationListId,
      });

      this.db.setData(reordered);
      this.updateLists();

      logger.log(
        "info",
        `Cards reordered from list ${sourceListName} to ${destinationListName}`
      );
    } catch (error) {
      logger.log(
        "error",
        `Error reordering cards from ${sourceListId} to ${destinationListId}: ${error.message}`
      );
    }
  }

  public renameCard(listId: string, cardId: string, newName: string): void {
    try {
      const lists = this.db.getData();
      const listName = this.getListName(listId);
      const oldName = this.getCardName(listId, cardId);

      const updatedLists = lists.map((list) =>
        list.id === listId
          ? list.setCards(
              list.cards.map(
                (card) =>
                  card.id === cardId ? card.cloneWithName(newName) : card // PATTERN:Prototype
              )
            )
          : list
      );

      this.db.setData(updatedLists);
      this.updateLists();

      logger.log(
        "info",
        `Card ${oldName} renamed to ${newName} in list ${listName}`
      );
    } catch (error) {
      logger.log(
        "error",
        `Error renaming card ${cardId} to ${newName} in list ${listId}: ${error.message}`
      );
    }
  }

  public changeDescription(
    listId: string,
    cardId: string,
    newDescription: string
  ): void {
    try {
      const lists = this.db.getData();
      const listName = this.getListName(listId);
      const cardName = this.getCardName(listId, cardId);

      const updatedLists = lists.map((list) =>
        list.id === listId
          ? list.setCards(
              list.cards.map((card) =>
                card.id === cardId
                  ? card.cloneWithDescription(newDescription) // PATTERN:Prototype
                  : card
              )
            )
          : list
      );

      this.db.setData(updatedLists);
      this.updateLists();

      logger.log(
        "info",
        `Card ${cardName} description changed in list ${listName}`
      );
    } catch (error) {
      logger.log(
        "error",
        `Error changing description of card ${cardId} in list ${listId}: ${error.message}`
      );
    }
  }

  public duplicateCard(listId: string, cardId: string): void {
    try {
      const lists = this.db.getData();
      const listName = this.getListName(listId);
      const cardName = this.getCardName(listId, cardId);

      const updatedLists = lists.map((list) =>
        list.id === listId
          ? list.setCards(
              list.cards.concat(
                list.cards
                  .filter((card) => card.id === cardId)
                  .map((card) => card.clone()) // PATTERN:Prototype
              )
            )
          : list
      );

      this.db.setData(updatedLists);
      this.updateLists();

      logger.log("info", `Card ${cardName} duplicated in list ${listName}`);
    } catch (error) {
      logger.log(
        "error",
        `Error duplicating card ${cardId} in list ${listId}: ${error.message}`
      );
    }
  }

  public deleteCard(listId: string, cardId: string): void {
    try {
      const lists = this.db.getData();
      const listName = this.getListName(listId);
      const cardName = this.getCardName(listId, cardId);

      const updatedLists = lists.map((list) =>
        list.id === listId
          ? list.setCards(list.cards.filter((card) => card.id !== cardId))
          : list
      );

      this.db.setData(updatedLists);
      this.updateLists();

      logger.log("info", `Card ${cardName} deleted from list ${listName}`);
    } catch (error) {
      logger.log(
        "error",
        `Error deleting card ${cardId} from list ${listId}: ${error.message}`
      );
    }
  }
}

export { CardHandler };
