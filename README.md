# Rova iCal Generator

This project is an Express.js server that dynamically generates and serves iCalendar (`.ics`) files for waste collection schedules of the Rova. The calendar data is fetched from the [ROVA API](https://www.rova.nl/) based on user-provided postal codes and house numbers. Users can download and import the generated `.ics` files into their calendar applications (e.g., Google Calendar, Apple Calendar) to receive reminders about upcoming waste collection events.

The Rova iCal uses Vercel Serverless Functions to develop and deploy the API.

## Usage 
If you're not looking to develop on the ROVA iCal Generator but simply want to stay informed about when to put your bin out, you can easily subscribe to the calendar. Just enter your details into the production URL and use that URL to subscribe in your favorite calendar app:

```bash
https://rova-ical.vercel.app/api?postalcode=1234AV&housenumber=10&addition=b
````

## Features

- **Dynamic iCalendar Generation**: Generates personalized `.ics` files based on the user's postal code and house number.
- **Automatic Reminders**: Includes built-in notifications for users, reminding them 2 days and 1 day before a waste collection event.
- **TypeScript**: The project is written in TypeScript, ensuring type safety, better code maintainability, and reduced runtime errors.
- **Vercel Serverless Finctions**: The iCalendar file is served via Vercel Serverless Functions. So no need for a custom server or build.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/daphnesmit/rova-ical.git
   cd rova-ical
   ```
2. **Install dependencies**:
   ```bash
    npm install
   ```
3. **Build the project**
   ```bash
    npm i vercel -g
   ```
4. **Run the dev server**
   ```bash
    vercel dev
   ```

## Usage

Once the server is running, users can generate their own waste collection calendar by accessing the following URL:

```bash
 http://localhost:3000/api?postalcode=<POSTAL_CODE>&housenumber=<HOUSE_NUMBER>&addition==<HOUSE_NUMBER_ADDITION>
```

Replace <POSTAL_CODE>, <HOUSE_NUMBER> and <HOUSE_NUMBER_ADDITION> with the user's actual postal code, house number and house number addition.

### Example

To generate a calendar for postal code 8043AT and house number 30, the URL would be:

```bash
http://localhost:3000/api?postalcode=8043AT&housenumber=30
```

## Development

### Prerequisites

- Node.js (v20.x or higher)
- npm
- Vercel CLI

### Running in Development Mode

You can run the project in development mode, which will automatically recompile the TypeScript code when changes are made:

```bash
vercel dev
```

### Deploying the project

You can deploy the project to vercel by running:

```bash
vercel
```

or for production:

```bash
vercel --prod
```

### Linting the Project

The project includes tsc and Prettier for code linting and formatting. You can run these tools with the following commands:

```bash
npm run lint
npm run format
```

## License

This project is licensed under the MIT License. See the LICENSE file for details.
