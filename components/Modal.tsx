'use client';

import { useCallback, useRef, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

function Modal({ children }: { children: ReactNode }) {
    const overlay = useRef<HTMLDivElement>(null);
    const wrapper = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const onDismiss = () => {
        router.push('/');
    };

    /**
     * The useCallback hook in React is used for memoizing (remembering) a function, so that it doesn't get recreated every time a component re-renders.
     * This can be useful for optimizing performance, particularly when passing that function as a prop to child components.
     */
    const handleClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            if (e.target === overlay.current && onDismiss) {
                onDismiss();
            }
        },
        [onDismiss, overlay]
    );

    return (
        <div ref={overlay} className="modal" onClick={handleClick}>
            <button
                type="button"
                onClick={onDismiss}
                className="absolute top-4 right-8"
            >
                <Image src={'/close.svg'} width={17} height={17} alt="close" />
            </button>
            <div ref={wrapper} className="modal_wrapper">
                {children}
            </div>
        </div>
    );
}

export default Modal;
