import ical, { ICalAlarmType } from 'ical-generator';
import axios from 'axios';
import Koa, { type Context } from 'koa';
import Router from '@koa/router';

// Define the shape of the API response data
interface WasteType {
  id: number;
  code: string;
  title: string;
  icon: string;
  notificationTitle: string;
  notificationText: string;
  notificationTitleSameDay: string;
  notificationTextSameDay: string;
}

interface WasteCollectionEvent {
  id: number;
  date: string;
  wasteType: WasteType;
  isIrregular: boolean;
}

const app = new Koa();
const router = new Router();
const ROVA_BASE_URL = 'https://www.rova.nl/api/waste-calendar/year';

// Generate and serve the iCal file based on query parameters
router.get('/calendar.ics', async (ctx: Context) => {
  const postalCode: string | undefined = ctx.query.postalcode as string;
  const houseNumber: string | undefined = ctx.query.housenumber as string;
  const year: number = new Date().getFullYear(); // Current year

  if (!postalCode || !houseNumber) {
    ctx.status = 400;
    ctx.body = 'Postal code and house number are required.';
    return;
  }

  const apiUrl = `${ROVA_BASE_URL}?postalcode=${postalCode}&houseNumber=${houseNumber}&addition=&year=${year}`;

  try {
    const response = await axios.get<WasteCollectionEvent[]>(apiUrl);
    const wasteCollectionData = response.data;

    const events = wasteCollectionData.map((event) => {
        const startTime = new Date(event.date);
  
        // Calculate the trigger times
        const twoDaysBefore = new Date(startTime);
        twoDaysBefore.setDate(startTime.getDate() - 2);
        twoDaysBefore.setHours(10, 0, 0, 0); // Set time to 10:00 AM
  
        const oneDayBefore = new Date(startTime);
        oneDayBefore.setDate(startTime.getDate() - 1);
        oneDayBefore.setHours(10, 0, 0, 0); // Set time to 10:00 AM
  
        return {
          id: event.id,
          timezone: 'Europe/Amsterdam',
          start: event.date,
          allDay: true,
          summary: event.wasteType.title,
          description: event.wasteType.notificationText,
          url: 'https://www.rova.nl/mijn-rova/dashboard',
          alarms: [
            {
              type: ICalAlarmType.display,
              trigger: twoDaysBefore,
              description: `Reminder: ${event.wasteType.notificationText}`,
            },
            {
              type: ICalAlarmType.display,
              trigger: oneDayBefore,
              description: `Reminder: ${event.wasteType.notificationText}`,
            },
          ],
        }
      });

    const calendar = ical({
      prodId: '//rova.nl//ical',
      name: 'Rova Waste Collection Schedule',
      events
    });


    // Set the headers and body to serve the calendar as a .ics file
    ctx.set('Content-Type', 'text/calendar; charset=utf-8');
    ctx.set('Content-Disposition', 'attachment; filename="calendar.ics"');

    ctx.body = calendar.toString();
  } catch (error) {
    console.error('Error fetching data or generating calendar:', error);
    ctx.status = 500;
    ctx.body = 'Internal server error.';
  }
});

// Apply the router middleware to the Koa app
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
