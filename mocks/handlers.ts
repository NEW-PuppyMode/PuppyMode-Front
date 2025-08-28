import { calendarHandlers } from './api/calendar';
import { puppyHandlers } from './api/puppy';

export const handlers = [...puppyHandlers, ...calendarHandlers];
