
import { billetGenerator } from '../src/handler';
import { BilletServiceFactory } from '../src/factory/BilletServiceFactory';


jest.mock('../src/factory/BilletServiceFactory');

const mockGenerateBilletUseCase = {
  execute: jest.fn(),
};


beforeEach(() => {
  (BilletServiceFactory.createGenerateBilletUseCase as jest.Mock).mockReturnValue(mockGenerateBilletUseCase);
  jest.clearAllMocks();
});

describe('billetGenerator handler', () => {
  it('should parse pubsub message and call the use case', async () => {
    
    const pubSubMessage = { data: Buffer.from(JSON.stringify({ docId: '123' })).toString('base64') };
    mockGenerateBilletUseCase.execute.mockResolvedValue(undefined); 

    
    await billetGenerator(pubSubMessage as any);

    
    expect(BilletServiceFactory.createGenerateBilletUseCase).toHaveBeenCalledTimes(1);
    expect(mockGenerateBilletUseCase.execute).toHaveBeenCalledWith({ docId: '123' });
  });

  it('should re-throw an error if the use case fails', async () => {
    
    const pubSubMessage = { data: Buffer.from(JSON.stringify({ docId: '123' })).toString('base64') };
    const aError = new Error('Use case failed!');
    mockGenerateBilletUseCase.execute.mockRejectedValue(aError); 

    
    await expect(billetGenerator(pubSubMessage as any)).rejects.toThrow('Use case failed!');
  });
});
