import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
gsap.registerPlugin(ScrollToPlugin);

export default function Title() {
    const titleRef = useRef(null);
    const contactRef = useRef(null);

    function scrollTo() {
        const anim = gsap.to(window, {
            duration: 2.5,
            scrollTo: window.innerHeight,
        });
    }

    useEffect(() => {
        gsap.fromTo(
            titleRef.current,
            {
                opacity: 0,
            },
            {
                duration: 2,
                opacity: 1,
                delay: 1.5,
            }
        );
    }, []);

    return (
        <>
            <Link
                className={
                    'title fixed left-6 top-4 text-2xl md:left-8 md:text-3xl'
                }
                ref={titleRef}
                href={'/'}
            >
                <span className={'text-teal-400'}>A</span>
                lexandre Coyra
                <span className={'text-teal-400'}>s</span>
                <br />
                <span
                    className={
                        'sub-title block text-xl text-teal-400 md:text-xl'
                    }
                >
                    Developer
                </span>
            </Link>

            <button
                onClick={scrollTo}
                className={
                    'fixed right-6 top-5 text-2xl transition-colors duration-300 hover:text-teal-400 md:right-8 md:text-3xl'
                }
                ref={contactRef}
            >
                <span className={'mori'}>Contact</span>
            </button>
        </>
    );
}
