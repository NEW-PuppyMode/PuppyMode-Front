import { calendarHandlers } from './api/calendar';
import { onboardHandlers } from './api/onboard';
import { puppyHandlers } from './api/puppy';

export const handlers = [...puppyHandlers, ...calendarHandlers, ...onboardHandlers];
