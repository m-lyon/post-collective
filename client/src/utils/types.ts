import { Dispatch, SetStateAction } from 'react';
import { DateFormat } from './dates';

export interface User {
    _id: string;
    aptNum?: number;
    name: string;
}

export interface Offer {
    _id: string;
    date: string;
    user: User;
}

export interface Request {
    _id: string;
    date: string;
    user: User;
    offeredDate: any;
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
export type ToggleRequestedFunction = (request: Request) => void;
export type SetDaysFunction = Dispatch<SetStateAction<DateFormat[]>>;
export type SetOfferedFunction = Dispatch<SetStateAction<Offer[]>>;
export type SetRequestedFunction = Dispatch<SetStateAction<RequestedDays>>;