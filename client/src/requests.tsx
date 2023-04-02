import axios from 'axios';
import { DateFormat } from './DateFormat.js';
import { RequestResponse, Request, RequestedDays } from './types';
import { SetRequestedFunction } from './types';
import { getConfig } from './utils.js';

export function setRequestedDays(
    daysState: DateFormat[],
    setRequested: SetRequestedFunction,
    requests: RequestResponse[]
): void {
    const requestedDates = requests.map((data) => new DateFormat(data.date).getDateStr());
    const requestedDays: RequestedDays = daysState.map((day) => {
        if (requestedDates.includes(day.getDateStr())) {
            return parseRequestResponse(
                requests.find((_, index) => {
                    return day.getDateStr() === requestedDates[index];
                })
            );
        } else {
            return null;
        }
    });
    setRequested(requestedDays);
}

export async function getRequestedDaysForUser(
    token: string,
    daysState: DateFormat[]
): Promise<RequestResponse[]> {
    const response = await axios.get(
        `${process.env.SERVER_ADDR}/requested`,
        getConfig(token, {
            startDate: daysState[0].getDateStr(),
            endDate: daysState[daysState.length - 1].getDateStr(),
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
 * @param requestResponse
 * @param requestedDays
 * @param setRequested
 */
export function toggleRequestedDay(
    index: number,
    requestResponse: RequestResponse,
    requestedDays: RequestedDays,
    setRequested: SetRequestedFunction
): void {
    // Recommended to not mutate array for setState callback
    console.log('updateRequestedDayState has been called.');
    const updatedRequestedDays = requestedDays.map((requestedDay, i) => {
        if (i === index) {
            if (requestedDay !== null) {
                return null;
            }
            return parseRequestResponse(requestResponse);
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
