import ical, { ICalAlarmType } from 'ical-generator';

import axios from 'axios';

const ROVA_BASE_URL = 'https://www.rova.nl/api/waste-calendar/year';

// Interfaces for the API response data
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

// Function to fetch waste collection data from the API
async function fetchWasteCollectionData(
  postalCode: string,
  houseNumber: string,
  addition: string,
  year: number,
): Promise<WasteCollectionEvent[]> {
  const apiUrl = `${ROVA_BASE_URL}?postalcode=${postalCode}&houseNumber=${houseNumber}&addition=${addition}&year=${year}`;
  const response = await axios.get<WasteCollectionEvent[]>(apiUrl);
  return response.data;
}

// Function to calculate alarm times based on event date
function calculateAlarmTimes(eventDate: string): {
  twoDaysBefore: Date;
  oneDayBefore: Date;
} {
  const startTime = new Date(eventDate);

  const twoDaysBefore = new Date(startTime);
  twoDaysBefore.setDate(startTime.getDate() - 2);
  twoDaysBefore.setHours(10, 0, 0, 0); // Set time to 10:00 AM

  const oneDayBefore = new Date(startTime);
  oneDayBefore.setDate(startTime.getDate() - 1);
  oneDayBefore.setHours(10, 0, 0, 0); // Set time to 10:00 AM

  return { twoDaysBefore, oneDayBefore };
}

// Function to generate iCal events from waste collection data
function generateICalEvents(
  wasteCollectionData: WasteCollectionEvent[],
): any[] {
  return wasteCollectionData.map((event) => {
    const { twoDaysBefore, oneDayBefore } = calculateAlarmTimes(event.date);

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
    };
  });
}

// Function to create the iCal calendar
function createICalendar(events: any[]): string {
  const calendar = ical({
    prodId: '//rova.nl//ical',
    name: 'Rova Waste Collection Schedule',
    events,
  });

  return calendar.toString();
}

// The main GET handler function
export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const year = new Date().getFullYear(); // Current year

  const postalCode = url.searchParams.get('postalcode');
  const houseNumber = url.searchParams.get('housenumber');
  const addition = url.searchParams.get('addition') || ''; // Addition, default to empty string if not provided

  if (!postalCode || !houseNumber) {
    return new Response('Postal code and house number are required.', {
      status: 400,
    });
  }

  try {
    const wasteCollectionData = await fetchWasteCollectionData(
      postalCode,
      houseNumber,
      addition,
      year,
    );
    const events = generateICalEvents(wasteCollectionData);
    const calendarString = createICalendar(events);

    const headers = {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="calendar.ics"',
    };

    return new Response(calendarString, { headers });
  } catch (error) {
    console.error('Error fetching data or generating ROVA iCal:', error);
    return new Response('Internal server error.', { status: 500 });
  }
}
