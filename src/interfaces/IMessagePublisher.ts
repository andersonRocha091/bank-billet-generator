export interface IMessagePublisher {
    publishMessage(message: string, topicName: string): Promise<string>;
    setTopicName(topicName: string): void;
}