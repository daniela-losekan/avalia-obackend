export default class Message {
  public id: number;
  public description: string;
  public details: string;

  constructor (id: number, description: string, details: string) {
    this.id = id;
    this.description = description;
    this.details = details;
  }
};