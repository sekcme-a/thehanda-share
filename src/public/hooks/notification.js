import axios from "axios";

export const sendNotification = (token, title, message) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post('/api/notification', {
        token: token
      });
      await fetch('/api/notification',{
        method:"POST",
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({token: token,title:title, message: message})
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
}
