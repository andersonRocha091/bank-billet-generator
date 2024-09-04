import { ISubscriber } from '../interfaces/ISubscriber';
import { PubSub, Subscription } from '@google-cloud/pubsub';


export class PubSubSubscriber implements ISubscriber {

    private pubSubClient: PubSub;
    private projectId?: string;

    constructor(projectId?: string) {
        this.pubSubClient = new PubSub();
        this.projectId = projectId;
    }

    async subscribeToTopic(topicName: string, projectId?: string): Promise<Subscription> {
        
        const subscriptionName = `subscription-${topicName}`;
        
        if (!projectId) {
            throw new Error('Project ID is required to create a subscription');
        }

        const subscription = await this.pubSubClient.subscription(subscriptionName);
        const [exists] = await subscription.exists();

        if (exists) {
            return subscription;
        }

        try {
          const [newSubscription] = await this.pubSubClient.createSubscription(topicName, subscriptionName);
          console.log(`Subscription ${subscriptionName} created.`);
          return newSubscription;
        } catch (error) {
          console.error(`Failed to create subscription ${subscriptionName}:`, error);
          throw error;
        }
      }

    async unsubscribeFromTopic(topicName: string): Promise<void> {

        const subscriptionName = `subscription-${topicName}`;
        const subscription = await this.pubSubClient.subscription(subscriptionName);
        await subscription.delete();

    }
}