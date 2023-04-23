# Travelski Resource Notifier

This is a Node.js script that checks for new or updated resources on the Travelski API and sends email notifications when new resources are found.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- A Gmail account with ["App Passwords"](https://support.google.com/accounts/answer/185833?hl=en) (to send email notifications)

## Installation

1. Clone the repository or download the ZIP file and extract its contents.

```bash
git clone https://github.com/MRakox/Travelski.git
```

2. Install the dependencies

```bash
cd travelski-resource-monitor
npm install
```

3. Copy the `config.example.json` file to `config.json` and edit it to include your Gmail account details, the email recipient address, and the API endpoint URL.

```bash
cp config.example.json config.json
```

4. Run the application

```bash
npm start
```

The application will check for new or updated resources every 12 hours and send an email notification for each new or updated resource.

## Configuration

The [`config.json`](config.example.json) file contains the following properties:

- `email`: An object containing the `user` and `password` of the Gmail account that will send the email notifications. And the `recipient`, the email address of the recipient of the email notifications.
- `apiUrl`: The URL of the Travelski API endpoint to check for new resources.

## License

This project is licensed under the [MIT License](LICENSE).
