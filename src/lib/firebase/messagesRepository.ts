export interface ContactMessageDoc {
  name: string;
  email: string;
  topic: string;
  message: string;
  createdAt: string;
}

export interface MessagesRepository {
  create(doc: ContactMessageDoc): Promise<{ id: string }>;
}

export const messagesRepository: MessagesRepository = {
  async create(): Promise<{ id: string }> {
    throw new Error("Messages repository is not implemented.");
  },
};
