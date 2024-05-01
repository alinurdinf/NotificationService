        function startNotificationService() {
            const pollingInterval = 5000; 
            setInterval(pollMessages, pollingInterval);
            console.log('Service worker started. Polling for messages...');
        }

        async function pollMessages() {
            try {
                const url = 'http://localhost:3000/get-message?queueName=dandory';
                const response = await axios.get(url);
                console.log(response.data);
                if (response.status === 200) {
                  console.log(response);
                    const message = response.data;
                    console.log("Received message:", message);
                    if (message) {
                        showNotification('New Message', message.message);
                    }
                } else {
                    console.error('Failed to retrieve message:', response.statusText);
                }
            } catch (error) {
                console.error('Error retrieving message:', error.message);
            }
        }

        function showNotification(title, body) {
            if ('Notification' in window) {
                Notification.requestPermission(permission => {
                    if (permission === 'granted') {
                        new Notification(title, { body: body });
                    }
                });
            } else {
                console.error('This browser does not support notifications');
            }
        }
