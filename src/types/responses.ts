export type ContactResponse = {
  contacts: Contact[];
};

export type MessagesResponse = {
  messages: Message[];
};

export enum MessageStatus {
  PENDING = "pending",
  SENT = "sent",
  FAILED = "failed",
  PARTIAL = "partial",
}

export type Message = {
  scheduledAt: Date | null;
  id: number;
  text: string;
  status: MessageStatus;
  createdAt: Date;
  contacts: Contact[];
};

export type Contact = {
  id: number;
  name: string;
  chatId: string;
  type: "person" | "group";
};
