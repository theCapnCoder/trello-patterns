import type { Socket } from 'socket.io';
import { ListEvent } from '../common/enums/enums';
import { List } from '../data/models/list';
import { SocketHandler } from './socket.handler';
import { Logger } from '../logging/logger';
import { FileLogger } from '../logging/fileLogger';
import { ConsoleErrorLogger } from '../logging/consoleErrorLogger';

// PATTERN: Observer - Logger acts as the Publisher
const logger = new Logger();
// PATTERN: Observer - FileLogger acts as a Subscriber
logger.subscribe(new FileLogger());
// PATTERN: Observer - ConsoleErrorLogger acts as a Subscriber
logger.subscribe(new ConsoleErrorLogger());

class ListHandler extends SocketHandler {
  public handleConnection(socket: Socket): void {
    socket.on(ListEvent.CREATE, this.createList.bind(this));
    socket.on(ListEvent.GET, this.getLists.bind(this));
    socket.on(ListEvent.RENAME, this.renameList.bind(this));
    socket.on(ListEvent.REORDER, this.reorderLists.bind(this));
    socket.on(ListEvent.DELETE, this.deleteList.bind(this));
  }

  private getListName(listId: string): string {
    const list = this.db.getData().find(list => list.id === listId);
    return list?.name || 'Unknown List';
  }

  private getLists(callback: (lists: List[]) => void): void {
    callback(this.db.getData());
  }

  private reorderLists(sourceIndex: number, destinationIndex: number): void {
    try {
      const lists = this.db.getData();
      const reorderedLists = this.reorderService.reorder(
        lists,
        sourceIndex,
        destinationIndex
      );
      this.db.setData(reorderedLists);
      this.updateLists();

      logger.log(
        'info',
        `Lists reordered from index ${sourceIndex} to ${destinationIndex}`
      );
    } catch (error) {
      logger.log('error', `Error reordering lists: ${error.message}`);
    }
  }

  public createList(name: string): void {
    try {
      const lists = this.db.getData();
      const newList = new List(name);
      this.db.setData(lists.concat(newList));
      this.updateLists();

      logger.log('info', `List created: ${newList.name}`);
    } catch (error) {
      logger.log('error', `Error creating list ${name}: ${error.message}`);
    }
  }

  public renameList(listId: string, newName: string): void {
    try {
      const lists = this.db.getData();
      const oldName = this.getListName(listId);
      const updatedLists = lists.map(
        list => (list.id === listId ? list.cloneWithName(newName) : list) // PATTERN: Prototype
      );
      this.db.setData(updatedLists);
      this.updateLists();

      logger.log('info', `List ${oldName} renamed to ${newName}`);
    } catch (error) {
      logger.log(
        'error',
        `Error renaming list ${this.getListName(listId)} to ${newName}: ${error.message}`
      );
    }
  }

  public deleteList(listId: string): void {
    try {
      const lists = this.db.getData();
      const listName = this.getListName(listId);
      const updatedLists = lists.filter(list => list.id !== listId);
      this.db.setData(updatedLists);
      this.updateLists();

      logger.log('info', `List ${listName} deleted`);
    } catch (error) {
      logger.log(
        'error',
        `Error deleting list ${this.getListName(listId)}: ${error.message}`
      );
    }
  }
}

export { ListHandler };
