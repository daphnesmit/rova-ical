# Rova iCal Generator

This project is an Express.js server that dynamically generates and serves iCalendar (`.ics`) files for waste collection schedules of the Rova. The calendar data is fetched from the [ROVA API](https://www.rova.nl/) based on user-provided postal codes and house numbers. Users can download and import the generated `.ics` files into their calendar applications (e.g., Google Calendar, Apple Calendar) to receive reminders about upcoming waste collection events. 

## Features

- **Dynamic iCalendar Generation**: Generates personalized `.ics` files based on the user's postal code and house number.
- **Automatic Reminders**: Includes built-in notifications for users, reminding them 2 days and 1 day before a waste collection event.
- **TypeScript**: The project is written in TypeScript, ensuring type safety, better code maintainability, and reduced runtime errors.
- **REST API**: The iCalendar file is served via a simple REST API, making it easy to integrate into other services or applications.

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
    npm run build
   ```
4. **Run the server**
   ```bash
    npm start
   ```

## Usage

Once the server is running, users can generate their own waste collection calendar by accessing the following URL:

```bash
 http://localhost:3000/calendar.ics?postalcode=<POSTAL_CODE>&housenumber=<HOUSE_NUMBER>&addition==<HOUSE_NUMBER_ADDITION>
```

Replace <POSTAL_CODE>, <HOUSE_NUMBER> and <HOUSE_NUMBER_ADDITION> with the user's actual postal code, house number and house number addition.

### Example

To generate a calendar for postal code 8043AT and house number 30, the URL would be:

```bash
http://localhost:3000/calendar.ics?postalcode=8043AT&housenumber=30
```

## Configuration

- Port: By default, the server runs on port 3000. You can change this by modifying the app.listen function in the src/index.ts file.

## Development

### Prerequisites

- Node.js (v20.x or higher)
- npm

### Building the Project

To compile the TypeScript code into JavaScript, run:

```bash
npm run build
```

The compiled code will be located in the dist directory.

### Running in Development Mode

You can run the project in development mode, which will automatically recompile the TypeScript code when changes are made:

```bash
npm run dev
```

### Running in Production Mode

You can run the project in prod mode, this will build the project and start up a node server for dist/index.js:

```bash
npm run serve
```

### Linting and Formatting

The project includes ESLint and Prettier for code linting and formatting. You can run these tools with the following commands:

```bash
npm run lint
npm run format
```

## Deployment

To deploy this project, ensure your environment can run Node.js applications. Once deployed, users can generate their .ics files by accessing the corresponding URL with their postal code and house number.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
