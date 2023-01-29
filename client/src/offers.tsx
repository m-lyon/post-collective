import axios from 'axios';
import { DateFormat } from './DateFormat.js';
import { Offer, SetOfferedFunction, OfferedDays } from './types';
import { SERVER_ADDR } from './config';

export async function getOffers(days: DateFormat[]): Promise<Offer[]> {
    const response = await axios.get(`${SERVER_ADDR}/offered`, {
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
    const offeredDays = daysState.map((day) => {
        if (offeredDates.includes(day.getDateStr())) {
            return offers.find((_, index) => {
                return day.getDateStr() === offeredDates[index];
            });
        } else {
            return null;
        }
    });
    setOffered(offeredDays);
}

export function toggleOfferedDay(
    index: number,
    offer: Offer,
    offeredDays: OfferedDays,
    setOffered: SetOfferedFunction
) {
    // Recommended to not mutate array for setState callback
    console.log('updateOfferedDayState has been called.');
    const updatedOfferedDays = offeredDays.map((offeredDay: Offer, i: number) => {
        if (i === index) {
            if (offeredDay !== null) {
                return null;
            }
            return offer;
        }
        return offeredDay;
    });
    setOffered(updatedOfferedDays);
}
