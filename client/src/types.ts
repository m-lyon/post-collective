import { Dispatch, SetStateAction } from 'react';
import { DateFormat } from './DateFormat.js';

export interface User {
    _id: string;
    aptNum?: number;
}

export interface Offer {
    _id: string;
    date: string;
    user: User;
}

/**
 * This is the raw response sent back from the API
 */
export interface RequestResponse {
    _id: string;
    date: Date;
    offeredDate: string;
    user: User;
}

/**
 * This is a parsed request object
 */
export interface Request {
    _id: string;
    date: string;
    user: User;
    offeredDate: string;
}

export interface Message {
    _id: string;
    text: string;
    to: string;
    from: string;
    seen: boolean;
}


export type RequestedDays = Request[];
export type OfferedDays = Offer[];
export type AvailableDay = Offer[];
export type AvailableDays = AvailableDay[];
export type SetModalShowFunction = Dispatch<SetStateAction<boolean>>;
export type ToggleOfferedFunction = (offer: Offer) => void;
export type ToggleRequestedFunction = (request: RequestResponse) => void;
export type SetDaysFunction = Dispatch<SetStateAction<DateFormat[]>>;
export type SetOfferedFunction = Dispatch<SetStateAction<Offer[]>>;
export type SetRequestedFunction = Dispatch<SetStateAction<RequestedDays>>;