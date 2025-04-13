interface EmailConfig {
    transport: {
      service: string;
      host: string;
      port: number;
      secure: boolean;
      auth: {
        user: string;
        pass: string;
      };
      pool?: boolean;
      maxConnections?: number;
      rateLimit?: number;
    };
    defaults: {
      from: string;
      replyTo?: string;
    };
  }
  
  export const EmailConfig: EmailConfig = {
    transport: {
      service: process.env.EMAIL_SERVICE || 'Gmail',
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASSWORD || ''
      },
      pool: true,
      maxConnections: 5,
      rateLimit: 5
    },
    defaults: {
      from: `"Edukita System" <${process.env.EMAIL_FROM || 'no-reply@Edukita.edu'}>`,
      replyTo: process.env.EMAIL_REPLY_TO || 'support@Edukita.edu'
    }
  };
  