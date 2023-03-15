import { Expo } from 'expo-server-sdk';

const expo = new Expo();

export const sendPushNotification = async (token, message) => {
  if (!Expo.isExpoPushToken(token)) {
    console.error(`Push token ${token} is not a valid Expo push token`);
    return;
  }

  const messages = [{
    to: token,
    sound: 'default',
    body: message,
    data: { message },
  }];

  try {
    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    for (const chunk of chunks) {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    }

    const receiptIds = [];

    for (const ticket of tickets) {
      if (ticket.status === 'error') {
        console.error(`Error sending notification: ${ticket.message}`);
      } else {
        receiptIds.push(ticket.id);
      }
    }

    const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);

    for (const chunk of receiptIdChunks) {
      const receipts = await expo.getPushNotificationReceiptsAsync(chunk);

      for (const receipt of receipts) {
        if (receipt.status === 'error') {
          console.error(`There was an error with a receipt: ${receipt.message}`);
        } else if (receipt.status === 'ok') {
          console.log(`Push notification receipt: ${receipt}`);
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
}

// Usage example
// const token = 'ExponentPushToken[b--Gt0CD1B677VykcDp9at]';
// const message = 'Hello, world!';

// sendPushNotification(token, message);
