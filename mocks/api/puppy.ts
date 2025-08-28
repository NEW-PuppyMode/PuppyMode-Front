import { delay, http, HttpResponse } from 'msw';
import { API_BASE_URL } from '../setting';
import { PuppyInfoData } from './data/PuppyInfoData';

export const puppyHandlers = [
  http.get(`${API_BASE_URL}/main`, async () => {
    await delay(500);
    return HttpResponse.json(PuppyInfoData);
  }),
];
