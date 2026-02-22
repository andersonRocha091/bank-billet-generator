
import { KobanaService } from '../src/services/KobanaService';
import { IHttpClient } from '../src/interfaces/IHttpClient';
import { BankBillet } from '../src/domain/BankBillet';

const mockHttpClient: IHttpClient = {
  post: jest.fn(),
  setAuthToken: jest.fn(),
};

describe('KobanaService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call the http client with correct data and return a mapped RegisteredBillet', async () => {
    
    const service = new KobanaService(mockHttpClient, 'client-id', 'client-secret', 'http://api.url', 'http://auth.url');
    const billet = BankBillet.create({ 
        amount: 150, 
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
     });

    
    const mockApiResponse = {
      id: 'kobana-123',
      url: 'http://kobana.com/boleto/123',
      barcode: '12345 67890',
      customer_email: 'customer@from.api',
    };
    (mockHttpClient.post as jest.Mock).mockResolvedValue(mockApiResponse);

    
    const result = await service.createBillet(billet, 'fake-token');

    
    
    expect(mockHttpClient.setAuthToken).toHaveBeenCalledWith('fake-token');
    
    
    expect(mockHttpClient.post).toHaveBeenCalledWith('http://api.url/v1/bank_billets', billet.getData());

    
    expect(result).toEqual({
      id: 'kobana-123',
      url: 'http://kobana.com/boleto/123',
      barcode: '12345 67890',
      customerEmail: 'customer@from.api',
    });
  });
});
