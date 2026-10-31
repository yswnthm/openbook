'use client';

import { useEffect, useState } from 'react';

export function useIsSafari() {
    const [isSafari, setIsSafari] = useState(false);

    useEffect(() => {
        setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));
    }, []);

    return isSafari;
}
