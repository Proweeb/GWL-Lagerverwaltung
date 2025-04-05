import AsyncStorage from '@react-native-async-storage/async-storage';
import { composeEmailWithDefault } from './emailUtils';
import ArtikelService from '../../../database/datamapper/ArtikelHelper';
import { EmailBodies } from '../../enum';


const LAST_CHECK_KEY = 'lastExpiryCheck';

export const checkExpiredItems = async () => {
  try {
    // Get last check date
    const lastCheckStr = await AsyncStorage.getItem(LAST_CHECK_KEY);
    const lastCheck = lastCheckStr ? new Date(lastCheckStr) : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Only check once per day
    if (lastCheck && lastCheck.toDateString() === today.toDateString()) {
      return null;
    }

    // Get all articles
    const articles = await ArtikelService.getAllArtikel();
    const expiredItems = [];

    // Check each article
    for (const article of articles) {
      if (article.ablaufdatum && article.menge > 0) {
        const expiryDate = new Date(article.ablaufdatum);
        expiryDate.setHours(0, 0, 0, 0);

        if (expiryDate <= today) {
          expiredItems.push({
            beschreibung: article.beschreibung,
            gwId: article.gwId,
            menge: article.menge,
            ablaufdatum: article.ablaufdatum
          });
        }
      }
    }

    // Update last check date
    await AsyncStorage.setItem(LAST_CHECK_KEY, today.toISOString());

    return expiredItems;
  } catch (error) {
    console.error('Error checking expired items:', error);
    return null;
  }
};

export const sendExpiryNotification = async (expiredItems) => {
  if (!expiredItems || expiredItems.length === 0) return;

  try {
    const subject = `Ablaufdatum Warnung: ${expiredItems.length} Artikel`;
    let body = EmailBodies.EXPIRED_ITEMS;

    expiredItems.forEach(item => {
      body += `- ${item.beschreibung} (GWID: ${item.gwId})\n`;
      body += `  Menge: ${item.menge}\n`;
      body += `  Ablaufdatum: ${new Date(item.ablaufdatum).toLocaleDateString('de-DE')}\n\n`;
    });

    body += EmailBodies.SIGNATURE;

    await composeEmailWithDefault({
      subject,
      body
    });
  } catch (error) {
    console.error('Error sending expiry notification:', error);
    throw error;
  }
}; 