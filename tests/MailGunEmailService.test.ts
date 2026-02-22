
import { MailGunEmailService } from '../src/services/MailGunEmailService';


jest.mock('mailgun-js', () => {
  
  const MailgunMock = jest.fn().mockImplementation(() => ({
    messages: jest.fn().mockReturnThis(), 
    send: jest.fn(), 
  }));
  return MailgunMock;
});


import MailGun from 'mailgun-js';


const MockedMailGun = MailGun as jest.MockedClass<typeof MailGun>;
const mockMailgunInstance = {
    messages: jest.fn().mockReturnThis(),
    send: jest.fn(),
};

describe('MailGunEmailService', () => {
  let service: MailGunEmailService;
  const mockApiKey = 'test-api-key';
  const mockDomain = 'test-domain.com';
  const mockFromEmail = `Mailgun Sandbox <postmaster@${mockDomain}>`;

  beforeEach(() => {
    jest.clearAllMocks();
    
    MockedMailGun.mockClear();
    (MockedMailGun as jest.Mock).mockImplementation(() => mockMailgunInstance);
    
    
    service = new MailGunEmailService(mockApiKey, mockDomain);
    process.env.MAILGUN_DOMAIN = mockDomain;
  });

  it('should send an email successfully', async () => {
    
    const to = 'recipient@example.com';
    const subject = 'Test Subject';
    const text = 'Test Email Body';

    
    mockMailgunInstance.send.mockResolvedValue({
      id: '<mock-id@mock-domain.com>',
      message: 'Queued. Thank you.',
    });

    
    await service.sendEmail(to, subject, text);

    
    expect(MockedMailGun).toHaveBeenCalledWith({
      apiKey: mockApiKey,
      domain: mockDomain,
    });
    expect(mockMailgunInstance.messages).toHaveBeenCalledTimes(1);
    expect(mockMailgunInstance.send).toHaveBeenCalledWith({
      from: mockFromEmail,
      to,
      subject,
      text,
    });
  });

  it('should throw an error if mailgun fails to send email', async () => {
    
    const to = 'recipient@example.com';
    const subject = 'Test Subject';
    const text = 'Test Email Body';
    const error = new Error('Mailgun API error');

    
    mockMailgunInstance.send.mockRejectedValue(error);

    
    await expect(service.sendEmail(to, subject, text)).rejects.toThrow(error);
  });
});
