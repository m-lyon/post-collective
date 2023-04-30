import axios from 'axios';
import { DateFormat } from './dates';
import { Request, RequestedDays } from './types';
import { SetRequestedFunction } from './types';
import { getConfig } from './auth';

export function setRequestedDays(
    daysState: DateFormat[],
    setRequested: SetRequestedFunction,
    requests: Request[]
): void {
    const requestedDates = requests.map((request) => request.date);
    const requestedDays: RequestedDays = daysState.map((day) => {
        if (requestedDates.includes(day.getDateStr())) {
            return requests.find((request) => {
                return day.getDateStr() === request.date;
            });
        } else {
            return null;
        }
    });
    setRequested(requestedDays);
}

export async function getRequestedDaysForUser(
    token: string,
    days: DateFormat[]
): Promise<Request[]> {
    if (days.length === 0) {
        return [];
    }
    const response = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/requested`,
        getConfig(token, {
            startDate: days[0].getDateStr(),
            endDate: days[days.length - 1].getDateStr(),
        })
    );
    return response.data;
}

/**
 * Updates requestedDays array at index position,
 * if day is null, then will set with Request data,
 * conversely if day contains a request, then will set
 * to null.
 * @param index
 * @param request
 * @param requestedDays
 * @param setRequested
 */
export function toggleRequestedDay(
    index: number,
    request: Request,
    setRequested: SetRequestedFunction
): void {
    console.log('updateRequestedDayState has been called.');
    setRequested((requestedDays) => {
        return requestedDays.map((requestedDay, i) => {
            if (i === index) {
                if (requestedDay !== null) {
                    return null;
                }
                return request;
            }
            return requestedDay;
        });
    });
}
