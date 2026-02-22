
import { CreateBilletUseCase, CreateBilletInput } from '../src/usecases/CreateBilletUseCase';
import { IMessagePublisher } from '../src/interfaces/IMessagePublisher';
import { IDataSaver } from '../src/interfaces/IDataSaver';

const mockMessagePublisher: IMessagePublisher = {
  setTopicName: jest.fn(),
  publishMessage: jest.fn().mockResolvedValue('mock-message-id'),
};

const mockDataSaver: IDataSaver<any> = {
  saveData: jest.fn().mockResolvedValue('mock-doc-id'), 
};

describe('CreateBilletUseCase', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should validate, save data, and publish a message on successful execution', async () => {
    
    const useCase = new CreateBilletUseCase(mockMessagePublisher, mockDataSaver);
    const input: CreateBilletInput = {
      amount: 100,
      expire_at: '2026-12-31',
      customer_person_name: 'Test Customer',
      customer_cnpj_cpf: '12345678901',
      customer_state: 'SP',
      customer_city_name: 'Test City',
      customer_email: 'test@example.com',
      customer_zipcode: '12345678',
      customer_address: 'Test Address',
      customer_neighborhood: 'Test Neighborhood',
      document_type: 'DM',
      acceptance: 'true',
      recipient_account: '123',
      prevent_pix: false,
      reduction_amount: 0,
      instructions_mode: 1,
      interest_type: 1,
      interest_days_type: 1,
      fine_type: 1,
      discount_type: 1,
      charge_type: 1,
      dispatch_type: 1,
      payment_count: 1,
    };

    
    await useCase.execute(input);

    
    
    expect(mockDataSaver.saveData).toHaveBeenCalledTimes(1);
    expect(mockDataSaver.saveData).toHaveBeenCalledWith(expect.objectContaining({ amount: 100 }));
    
    
    expect(mockMessagePublisher.setTopicName).toHaveBeenCalledWith('billet-stream');
    expect(mockMessagePublisher.publishMessage).toHaveBeenCalledTimes(1);
    const publishedMessage = JSON.parse((mockMessagePublisher.publishMessage as jest.Mock).mock.calls[0][0]);
    expect(publishedMessage.docId).toBe('mock-doc-id');
    expect(publishedMessage.billetData.amount).toBe(100);
  });

  it('should throw an error if input data is invalid', async () => {
    
    const useCase = new CreateBilletUseCase(mockMessagePublisher, mockDataSaver);
    const invalidInput = { amount: -50 }; 

    
    
    await expect(useCase.execute(invalidInput as any)).rejects.toThrow('Amount is required and must be greater than zero');
    
    
    expect(mockDataSaver.saveData).not.toHaveBeenCalled();
    expect(mockMessagePublisher.publishMessage).not.toHaveBeenCalled();
  });
});
