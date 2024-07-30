import type { DraggableProvided } from '@hello-pangea/dnd';

import { type Card } from '../../common/types/types';
import { CopyButton } from '../primitives/copy-button';
import { DeleteButton } from '../primitives/delete-button';
import { Splitter } from '../primitives/styled/splitter';
import { Text } from '../primitives/text';
import { Title } from '../primitives/title';
import { Container } from './styled/container';
import { Content } from './styled/content';
import { Footer } from './styled/footer';
import { CardEvent } from '../../common/enums/enums';
import { socket } from '../../context/socket';

type Props = {
  listId: string;
  card: Card;
  isDragging: boolean;
  provided: DraggableProvided;
};

export const CardItem = ({ listId, card, isDragging, provided }: Props) => {
  const onRenameCard = (newName: string) => {
    socket.emit(CardEvent.RENAME, listId, card.id, newName);
  };

  const onChangeDescription = (newDescription: string) => {
    socket.emit(CardEvent.CHANGE_DESCRIPTION, listId, card.id, newDescription);
  };

  const onDuplicateCard = () => {
    socket.emit(CardEvent.DUPLICATE, listId, card.id);
  };

  const onDeleteCard = () => {
    socket.emit(CardEvent.DELETE, listId, card.id);
  };

  return (
    <Container
      className="card-container"
      isDragging={isDragging}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      data-is-dragging={isDragging}
      data-testid={card.id}
      aria-label={card.name}
    >
      <Content>
        <Title
          onChange={onRenameCard}
          title={card.name}
          fontSize="large"
          isBold
        />
        <Text text={card.description} onChange={onChangeDescription} />
        <Footer>
          <DeleteButton onClick={onDeleteCard} />
          <Splitter />
          <CopyButton onClick={onDuplicateCard} />
        </Footer>
      </Content>
    </Container>
  );
};
