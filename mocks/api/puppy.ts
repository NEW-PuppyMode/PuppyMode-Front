import { delay, http, HttpResponse } from 'msw';
import { PuppyAdviceData, PuppyInfoData } from './data/PuppyInfoData';

export const puppyHandlers = [
  http.get(`*/main`, async () => {
    await delay(500);
    return HttpResponse.json(PuppyInfoData);
  }),
  http.get(`*/advice`, async () => {
    await delay(500);
    return HttpResponse.json(PuppyAdviceData);
  }),
];