import { sendPushNotification } from 'utils/push-notifications';

export default async function handler(req, res) {
  const { token, title,  message } = req.body;

  await sendPushNotification(token,title, message);

  res.status(200).json({ success: true });
}
