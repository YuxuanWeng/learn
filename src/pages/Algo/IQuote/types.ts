import { QuickChatCardInfo, QuickChatRoom } from '@fepkg/services/types/algo-common';

export type OperationCardProp = QuickChatCardInfo & {
  sendError?: string;
  loading?: boolean;
  isUpdBondChanged?: boolean;
};

export type RoomWithCards = QuickChatRoom & {
  cards: QuickChatCardInfo[];
};

export type SharedCards = RoomWithCards[];
