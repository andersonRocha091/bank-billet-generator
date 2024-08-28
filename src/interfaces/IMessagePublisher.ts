export interface IMessagePublisher {
    publishMessage(message: string): Promise<string>;
}