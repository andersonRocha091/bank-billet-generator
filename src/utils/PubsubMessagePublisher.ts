import { PubSub, Topic, Subscription } from '@google-cloud/pubsub';

import { IMessagePublisher } from '../interfaces/IMessagePublisher'
import { ISubscriber } from '../interfaces/ISubscriber'

import { PubSubSubscriber } from './PubSubSubscriber';





export class PubsubMessagePublisher implements IMessagePublisher {

    private topic!: Topic;
    private topicName: string;
    private pubSubClient: PubSub;
    private projectId?: string;
    private topicCache: Map<string, Topic> = new Map();
    private subscriber: ISubscriber;

    constructor(projectId?: string) {
        this.pubSubClient = new PubSub();
        this.projectId = projectId;
        this.subscriber = new PubSubSubscriber(projectId);
        this.topicName = '';
    }

    async initializeTopic(topicName: string): Promise<Topic> {
        
        try {
            
            this.topic = await this.createTopicIfDoesntExists(topicName);
            return this.topic;

        } catch (error) {

            console.log(`Error initializing topic:`, error);
            throw error;
        }
    }

    async createTopicIfDoesntExists(topicName: string): Promise<Topic> {

        const topicCached = this.topicCache.get(topicName);
        if(topicCached) {
            return topicCached;
        }
    
        let topicToConnect = await this.pubSubClient.topic(topicName);
        const [exists] = await topicToConnect.exists();

        if(!exists) {
            console.log(`Topic ${topicName} does not exist. Creating it...`);
            const[topic] = await this.pubSubClient.createTopic(topicName);
            topicToConnect = topic;
            console.log(`Topic ${topicName} created.`);
        } else {
            console.log(`Topic ${topicName} already exists.`);
        }
        this.topicCache.set(topicName, topicToConnect);
        return topicToConnect;
    }

    setTopicName(topicName: string): void {
        this.topicName = topicName;
    }

    async publishMessage(message: string, topicName: string): Promise<string> {
        
        if (!this.topic) {
            console.log(`INITIALIZING NEW TOPIC: ${topicName}`);
            await this.initializeTopic(topicName);
        }

        const dataBuffer = Buffer.from(message);
        const messageId = await this.topic.publishMessage({data: dataBuffer});
        console.log(`Message ${messageId} published.`);
        return messageId;
    }


    async subscribeToTopic(topicName: string): Promise<Subscription> {

        let subscription: Subscription;

        try {
            
            subscription = await this.subscriber.subscribeToTopic(topicName, this.projectId);
            return subscription;

        } catch (error) {
            
            console.log(`Error subscribing to topic:`, error);
            throw new Error(`Error subscribing to topic:`);
        }

    }

    async unsubscribeFromTopic(topicName: string): Promise<void> {

        await this.subscriber.unsubscribeFromTopic(topicName);
        
    }

}
