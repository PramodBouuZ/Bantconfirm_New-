import { SiteConfig } from '../types';

// This is a MOCK service. In a real application, you would integrate with a WhatsApp Business API provider.
const sendMessage = async (
  config: SiteConfig['whatsappConfig'],
  recipient: string,
  message: string
): Promise<{ success: boolean; message: string }> => {
  if (!config || !config.enabled) {
    return { success: false, message: 'WhatsApp notifications are disabled.' };
  }
  if (!config.apiEndpoint || !config.apiKey) {
    return { success: false, message: 'WhatsApp API credentials are not configured.' };
  }
  if (!recipient) {
    return { success: false, message: 'Recipient phone number is missing.' };
  }

  // MOCK API call
  console.log('--- MOCK WHATSAPP API ---');
  console.log(`Sending to: ${recipient}`);
  console.log(`Message: ${message}`);
  console.log('--------------------------');

  // Simulate an API call
  await new Promise(resolve => setTimeout(resolve, 500));

  // In a real scenario, you'd check the response from the WhatsApp API provider.
  return { success: true, message: `Message sent to ${recipient}` };
};

export const whatsAppService = {
  sendMessage,
};
