import axios from 'axios';
import { DateFormat } from './DateFormat.js';

import { RequestResponse, Request, RequestedDays } from './types';

import { SetRequestedFunction } from './types';

export function setRequestedDays(
    daysState: DateFormat[],
    setRequested: SetRequestedFunction,
    requests: RequestResponse[]
): void {
    const requestedDates = requests.map((data) => new DateFormat(data.date).getDateStr());
    const requestedDays: RequestedDays = daysState.map((day) => {
        if (requestedDates.includes(day.getDateStr())) {
            return {
                state: true,
                data: parseRequestResponse(
                    requests.find((_, index) => {
                        return day.getDateStr() === requestedDates[index];
                    })
                ),
            };
        } else {
            return { state: false };
        }
    });
    setRequested(requestedDays);
}

export async function getRequestedDaysForUser(
    daysState: DateFormat[],
    user: string
): Promise<RequestResponse[]> {
    const response = await axios.get('http://localhost:9000/requested', {
        params: {
            user: user,
            startDate: daysState[0].getDateStr(),
            endDate: daysState[daysState.length - 1].getDateStr(),
        },
    });
    return response.data;
}

export function updateRequestedDays(
    index: number,
    requestResponse: RequestResponse,
    requestedDays: RequestedDays,
    setRequested: SetRequestedFunction
): void {
    // Recommended to not mutate array for setState callback
    console.log('updateRequestedDayState has been called.');
    const updatedRequestedDays = requestedDays.map((requestedDay, i) => {
        if (i === index) {
            if (requestedDay.state) {
                return { state: false };
            }
            return { state: true, data: parseRequestResponse(requestResponse) };
        }
        return requestedDay;
    });
    setRequested(updatedRequestedDays);
}

function parseRequestResponse(requestResponse: RequestResponse): Request {
    return {
        _id: requestResponse._id,
        date: new DateFormat(requestResponse.date).getDateStr(),
        offeredDate: requestResponse.offeredDate,
        user: requestResponse.user,
    };
}
