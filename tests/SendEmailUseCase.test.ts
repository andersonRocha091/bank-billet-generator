
import { SendEmailUseCase, SendEmailInput } from '../src/usecases/SendEmailUseCase';
import { IEmailService } from '../src/interfaces/IEmailService';

const mockEmailService: IEmailService = {
  sendEmail: jest.fn().mockResolvedValue(undefined), 
};

describe('SendEmailUseCase', () => {
  let useCase: SendEmailUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new SendEmailUseCase(mockEmailService);
  });

  it('should send an email with the provided billet URL', async () => {
    
    const payload: SendEmailInput = {
      email: 'test@example.com',
      billetUrl: 'http://my-billet.com/123',
    };

    
    await useCase.execute(payload);

    
    expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(1);
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      payload.email,
      'Seu boleto foi gerado',
      `Acesse seu boleto aqui ${payload.billetUrl}`
    );
  });

  it('should throw an error if email service fails', async () => {
    
    const payload: SendEmailInput = {
      email: 'test@example.com',
      billetUrl: 'http://my-billet.com/123',
    };
    const error = new Error('Email sending failed');
    (mockEmailService.sendEmail as jest.Mock).mockRejectedValue(error);

    
    await expect(useCase.execute(payload)).rejects.toThrow(error);
  });
});
