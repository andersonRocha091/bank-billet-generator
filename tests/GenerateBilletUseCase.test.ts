
import { GenerateBilletUseCase, GenerateBilletInput } from '../src/usecases/GenerateBilletUseCase';
import { IBoletoService } from '../src/interfaces/IBoletoService';
import { IMessagePublisher } from '../src/interfaces/IMessagePublisher';
import { RegisteredBillet } from '../src/domain/RegisteredBillet';
import { BankBillet } from '../src/domain/BankBillet';

const mockBoletoService: IBoletoService = {
  getToken: jest.fn().mockResolvedValue('mock-token'),
  createBillet: jest.fn(),
};

const mockMessagePublisher: IMessagePublisher = {
  setTopicName: jest.fn(),
  publishMessage: jest.fn().mockResolvedValue('mock-message-id'),
};

describe('GenerateBilletUseCase', () => {
  let useCase: GenerateBilletUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GenerateBilletUseCase(mockBoletoService, mockMessagePublisher);
  });

  it('should generate billet, publish email event on successful creation', async () => {

    const payload: GenerateBilletInput = {
      docId: 'doc-123',
      billetData: {
        amount: 200,
        expire_at: '2026-01-01',
        customer_person_name: 'Jane Doe',
        customer_cnpj_cpf: '11122233344',
        customer_state: 'SP',
        customer_city_name: 'Sao Paulo',
        customer_email: 'jane@example.com',
        customer_zipcode: '01000-000',
        customer_address: 'Av. Paulista',
        customer_neighborhood: 'Bela Vista',
        document_type: 'DM',
        acceptance: 'true',
        recipient_account: 'acc-1',
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
      },
    };

    const mockRegisteredBillet: RegisteredBillet = {
      id: 'kobana-billet-id',
      url: 'http://kobana.com/billet/123',
      barcode: 'barcode-string',
      customerEmail: 'jane@example.com',
    };
    (mockBoletoService.createBillet as jest.Mock).mockResolvedValue(mockRegisteredBillet);

   
    await useCase.execute(payload);

    expect(mockBoletoService.getToken).toHaveBeenCalledTimes(1);
    expect(mockBoletoService.createBillet).toHaveBeenCalledTimes(1);
    expect(mockBoletoService.createBillet).toHaveBeenCalledWith(
        expect.any(BankBillet),
        'mock-token'
    );

    expect(mockMessagePublisher.setTopicName).toHaveBeenCalledWith('email-sender');
    expect(mockMessagePublisher.publishMessage).toHaveBeenCalledTimes(1);
    const emailPayload = JSON.parse((mockMessagePublisher.publishMessage as jest.Mock).mock.calls[0][0]);
    expect(emailPayload).toEqual({
        message: 'Billet Generated',
        data: {
            billetUrl: mockRegisteredBillet.url,
            email: mockRegisteredBillet.customerEmail,
        },
    });
  });

  it('should throw an error if boleto service fails', async () => {
   
    const payload: GenerateBilletInput = {
        docId: 'doc-123',
        billetData: {
            amount: 200,
            expire_at: '2026-01-01',
            customer_person_name: 'Jane Doe',
            customer_cnpj_cpf: '11122233344',
            customer_state: 'SP',
            customer_city_name: 'Sao Paulo',
            customer_email: 'jane@example.com',
            customer_zipcode: '01000-000',
            customer_address: 'Av. Paulista',
            customer_neighborhood: 'Bela Vista',
            document_type: 'DM',
            acceptance: 'true',
            recipient_account: 'acc-1',
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
        },
    };
    const error = new Error('Boleto service error');
    (mockBoletoService.createBillet as jest.Mock).mockRejectedValue(error);

    await expect(useCase.execute(payload)).rejects.toThrow(error);
    expect(mockMessagePublisher.publishMessage).not.toHaveBeenCalled();
  });
});
