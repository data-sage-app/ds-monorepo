### Clerk webhook setup

1. Install ngrok and set it up to route traffic to the 127.0.0.1:3000 (the next js web server). Optinoally sign up for ngrok and create a permanent connection
2. Create a webhook on clerk and set the endpoint as https://{ngrok endpoint}/api/clerk/webhook
3. View the signing key for the new webhook and add that to .env file (See .env.example for where to add it)
4. Users and orgs will now sync autoamtically. You may need to log out the user and log back in to trigger them to be added the first time
