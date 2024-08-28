export interface IDataSaver<T> {
    saveData(data: T): Promise<string>;
}