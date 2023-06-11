import { useState } from 'react';

export function useSubmit() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    async function handleSubmit(callback: () => Promise<void>) {
        setIsSubmitting(true);
        if (process.env.NODE_ENV === 'development') {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        await callback();
        setIsSubmitting(false);
        setHasSubmitted(true);
    }

    function resetSubmit() {
        setIsSubmitting(false);
        setHasSubmitted(false);
    }

    return { isSubmitting, hasSubmitted, handleSubmit, resetSubmit };
}
