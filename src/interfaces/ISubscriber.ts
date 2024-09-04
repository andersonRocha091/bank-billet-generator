import { Subscription } from '@google-cloud/pubsub';
export interface ISubscriber {
  subscribeToTopic(topicName: string, projectId?: string):Promise<Subscription>;
  unsubscribeFromTopic(topicName: string): Promise<void>;
}