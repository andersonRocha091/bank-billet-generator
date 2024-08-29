import { IDataSaver } from '../interfaces/IDataSaver';
import { Firestore } from '@google-cloud/firestore';

export class FirestoreDataSaver implements IDataSaver<string> {
   
    private readonly firestoreClient: Firestore;
    private readonly collectionName: string;
    constructor(colletionName: string) {
        this.firestoreClient = new Firestore();
        this.collectionName = colletionName;
    }

    async saveData(data: any): Promise<string> {
        try {
            const docRef = await this.firestoreClient.collection(this.collectionName).add(data);
            return docRef.id;
        } catch (error) {
            throw new Error(JSON.stringify(error))
        }
    }
}