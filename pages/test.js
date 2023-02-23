import { useState } from 'react';
import axios from 'axios';

function SendPushNotificationForm() {
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/notification', {
        token: token
      });
      fetch('/api/notification',{
        method:"POST",
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({token: token, message:"test"})
      })
      // setMessage(response.data.message);
    } catch (error) {
      console.log(error)
      // setMessage(error.response.data.error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Push Notification Token:
          <input
            type="text"
            value={token}
            onChange={(event) => setToken(event.target.value)}
          />
        </label>
        <button type="submit">Send Push Notification</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default SendPushNotificationForm