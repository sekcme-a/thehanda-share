import { sendPushNotification } from 'utils/push-notifications';

export default async function handler(req, res) {
  const { token, message } = req.body;

  await sendPushNotification(token, message);

  res.status(200).json({ success: true });
}
