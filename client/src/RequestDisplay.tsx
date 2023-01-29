import { RequestResponse } from './types';

interface RequestDisplayProps {
    userRequests: RequestResponse[];
}
export function RequestDisplay({ userRequests }: RequestDisplayProps) {
    if (userRequests.length === 0) {
        return <div className='select-box bg-white text-grey disabled'>0 Requests</div>;
    }
    if (userRequests.length === 1) {
        return <div className='select-box bg-white text-grey'>1 Request</div>;
    }
    return <div className='select-box bg-white text-grey'>{userRequests.length} Requests</div>;
}
