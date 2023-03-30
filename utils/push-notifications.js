import { Expo } from 'expo-server-sdk';

const expo = new Expo();


export const sendPushNotification = async (pushToken,title, message) => {
  // Check if the push token is valid
  console.log("asfd")
  console.log(pushToken)
  console.log(message)
  if (!Expo.isExpoPushToken(pushToken)) {
    console.error('Invalid push token:', pushToken);
    return;
  }

  // Create the notification object
  const notification = {
    to: pushToken,
    sound: 'default',
    title: title,
    body: message,
    data: { message },
  };

  // Send the notification
  try {
    if(message){
      const response = await expo.sendPushNotificationsAsync([notification]);
      console.log("RESPOSE", response);
    }
  } catch (error) {
    console.error(error);
  }
};




// import { Expo } from 'expo-server-sdk';

// const expo = new Expo();

// export const sendPushNotification = async (token, message) => {
//   if (!Expo.isExpoPushToken(token)) {
//     console.error(`Push token ${token} is not a valid Expo push token`);
//     return;
//   }

//   const messages = [{
//     to: token,
//     sound: 'default',
//     body: message,
//     data: { message },
//   }];

//   try {
//     const chunks = expo.chunkPushNotifications(messages);
//     const tickets = [];

//     for (const chunk of chunks) {
//       const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
//       tickets.push(...ticketChunk);
//     }

//     const receiptIds = [];
//     console.log("TICKETS",tickets)

//     for (const ticket of tickets) {
//       if (ticket.status === 'error') {
//         console.error(`Error sending notification: ${ticket.message}`);
//       } else {
//         receiptIds.push(ticket.id);
//       }
//     }

//     console.log("RECEIPTID",receiptIds)

//     const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
//     console.log("RECEIPTIDCHUNK",receiptIdChunks)

//     for (const chunk of receiptIdChunks) {
//       console.log("CHUNK",chunk)
//       const receipts = await expo.getPushNotificationReceiptsAsync(chunk);
//       console.log("RECEIPTS",receipts)

//       if (Array.isArray(receipts)) {
//         for (const receipt of receipts) {
//           if (receipt.status === 'error') {
//             console.error(`There was an error with a receipt: ${receipt.message}`);
//           } else if (receipt.status === 'ok') {
//             console.log(`Push notification receipt: ${receipt}`);
//           }
//         }
//       } else {
//         console.error(`Receipts is not an array: ${receipts}`);
//       }
//     }
//   } catch (error) {
//     console.error(error);
//   }
// }

// Usage example
// const token = 'ExponentPushToken[b--Gt0CD1B677VykcDp9at]';
// const message = 'Hello, world!';

// sendPushNotification(token, message);

