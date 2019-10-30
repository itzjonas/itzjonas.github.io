import { useState } from 'react';

export function useLoading() {
    const [loading, setLoading] = useState(false);

    const load = (aPromise) => {
        setLoading(true);

        return aPromise.then((...args) => {
            setLoading(false);

            return args;
        })
        .catch((...args) => {
            setLoading(false);

            return args;
        });
    }

    return [loading, load];
}
