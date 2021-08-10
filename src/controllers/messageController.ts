import { Request, Response } from "express";
import Message from "../models/Message";

const messages: Array<Message> = [];

class MessageController {
  public listAllMessages(req: Request, res: Response) {
    return res.status(200).json(messages);
  };

  public getMessageId(req: Request, res: Response) {
    const { id } = req.params;

    const findMessage = messages.find((message: any) => message.id == id);

    if (!findMessage) {
      return res.status(404).json({
        message: 'Esse recado não foi encontrado.'
      });
    }

    return res.status(200).json(findMessage);
  };

  public addMessage(req: Request, res: Response) {
    const { description, details } = req.body;

    const id: number = messages.length == 0 ? 1 : messages[messages.length - 1].id + 1;

    const message = new Message(
      id,
      description,
      details
    );

    messages.push(message);

    return res.status(200).json({
      success: true,
      data: message,
      message: 'Recado incluido com successo.'
    });
  };

  public updateMessage(req: Request, res: Response) {
    const { id } = req.params;
    const { description, details } = req.body;

    const findMessageIndex = messages.findIndex((message) => message.id == parseInt(id));

    if (findMessageIndex < 0) {
      return res.status(400).json({
        success: false,
        data: [],
        msg: 'O recado com este ID não foi encontrado.',
      });
    }

    messages[findMessageIndex].description = description;
    messages[findMessageIndex].details = details;

    return res.status(200).json({
      success: true,
      data: messages[findMessageIndex],
      message: 'Seu recado foi atualizado.',
    });
  };

  public deleteMessage(req: Request, res: Response) {
    const { id } = req.params;

    const findMessageIndex = messages.findIndex((message) => message.id == parseInt(id));

    if (findMessageIndex < 0) {
      return res.status(400).json({
        success: false,
        data: [],
        message: 'O recado com este ID não foi encontrado.',
      });
    }

    messages.splice(findMessageIndex, 1);

    return res.status(200).json({
      success: true,
      messages,
      message: 'Seu recado foi deletado.',
    });
  };
};

export default new MessageController;