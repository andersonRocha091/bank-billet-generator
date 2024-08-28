import { PubSub, Topic } from '@google-cloud/pubsub';
import { IMessagePublisher } from '../interfaces/IMessagePublisher'


export class PubsubMessagePublisher implements IMessagePublisher {

    private readonly topic: Topic;
    private pubSubClient: PubSub;

    constructor(topicName: string, projectId?: string) {
        this.pubSubClient = new PubSub();
        this.topic = this.pubSubClient.topic(topicName);
    }

    async publishMessage(message: string): Promise<string> {

        const dataBuffer = Buffer.from(message);
        const messageId = await this.topic.publishMessage({data: dataBuffer});
        return messageId;
    }

}