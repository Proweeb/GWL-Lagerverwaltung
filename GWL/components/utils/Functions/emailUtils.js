import * as MailComposer from 'expo-mail-composer';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Wrapper function for composing emails that checks for default recipient
 * @param {Object} options - Mail composer options
 * @param {string} options.subject - Email subject
 * @param {string} options.body - Email body
 * @param {string[]} options.attachments - Array of file URIs to attach
 * @param {string[]} [options.recipients] - Optional array of additional recipients
 * @returns {Promise<void>}
 */
export const composeEmailWithDefault = async (options) => {
  try {
    // Check if email composition is available
    const isAvailable = await MailComposer.isAvailableAsync();
    if (!isAvailable) {
      throw new Error('E-Mail-Dienst nicht verfügbar');
    }

    // Get default recipient email from settings
    const settings = await AsyncStorage.getItem("settings");
    const parsedSettings = settings ? JSON.parse(settings) : {};
    const defaultEmail = parsedSettings.email;
    
    // Prepare recipients array
    let recipients = options.recipients || [];
    if (defaultEmail) {
      recipients = [defaultEmail, ...recipients];
    }

    // Compose email with combined recipients
    await MailComposer.composeAsync({
      recipients,
      subject: options.subject,
      body: options.body,
      attachments: options.attachments
    });

  } catch (error) {
    console.error('Fehler beim E-Mail-Versand:', error);
    throw error;
  }
}; 