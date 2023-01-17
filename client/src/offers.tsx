import axios from 'axios';
import { DateFormat } from './DateFormat.js';
import { Offer, SetOfferedFunction } from './types';

export async function getOffers(days: DateFormat[]): Promise<Offer[]> {
    const response = await axios.get('http://localhost:9000/offered', {
        params: {
            startDate: days[0].getDateStr(),
            endDate: days[days.length - 1].getDateStr(),
        },
    });
    return response.data;
}

/**
 * Sets the offeredDay state used in Calendar component.
 *     takes the offeredDays response from backend, sets an array
 *     of booleans for the days that are offered by the current user
 */
export function setOfferedDays(
    daysState: DateFormat[],
    user: string,
    setOffered: SetOfferedFunction,
    offers: Offer[]
): void {
    const offeredDates = offers
        .filter((data) => data.user._id === user)
        .map((data) => new DateFormat(data.date).getDateStr());
    const isOfferedArray = daysState.map((day) => {
        return offeredDates.includes(day.getDateStr());
    });
    setOffered(isOfferedArray);
}

export function updateOfferedDays(
    index: number,
    offeredDays: boolean[],
    setOffered: SetOfferedFunction
) {
    // Recommended to not mutate array for setState callback
    console.log('updateOfferedDayState has been called.');
    const updatedOfferedDays = offeredDays.map((d: boolean, i: number) => {
        if (i === index) {
            return !d;
        }
        return d;
    });
    setOffered(updatedOfferedDays);
}
