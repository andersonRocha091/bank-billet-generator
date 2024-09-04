import { PubSub, Topic, Subscription } from '@google-cloud/pubsub';

import { IMessagePublisher } from '../interfaces/IMessagePublisher'
import { ISubscriber } from '../interfaces/ISubscriber'

import { PubSubSubscriber } from './PubSubSubscriber';





export class PubsubMessagePublisher implements IMessagePublisher {

    private topic!: Topic;
    private pubSubClient: PubSub;
    private projectId?: string;
    private topicCache: Map<string, Topic> = new Map();
    private subscriber: ISubscriber;

    constructor(topicName: string, projectId?: string) {
        this.pubSubClient = new PubSub();
        this.projectId = projectId;
        this.subscriber = new PubSubSubscriber(projectId);
        this.initializeTopic(topicName);
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
    
        const topic = await this.pubSubClient.topic(topicName);
        const [exists] = await topic.exists();

        if(!exists) {
            console.log(`Topic ${topicName} does not exist. Creating it...`);
            await this.pubSubClient.createTopic(topicName);
            console.log(`Topic ${topicName} created.`);
        } else {
            console.log(`Topic ${topicName} already exists.`);
        }
        this.topicCache.set(topicName, topic);
        return topic;
    }

    async publishMessage(message: string): Promise<string> {
        
        if (!this.topic) {
            throw new Error('Topic is not initialized. Please ensure the publisher is properly initialized.');
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
