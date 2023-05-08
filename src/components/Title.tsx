import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
gsap.registerPlugin(ScrollToPlugin);

export default function Title() {
    const titleRef = useRef(null);
    const contactRef = useRef(null);

    function scrollTo() {
        gsap.to(window, { duration: 2.5, scrollTo: window.innerHeight });
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

        // gsap.to(contactRef.current, {
        //     duration: 2.5,
        //     translateX: 0,
        //     delay:1,
        // });
    }, []);

    return (
        <>
            <Link
                className={
                    'top-4 left-6 md:left-8 title fixed text-2xl md:text-3xl'
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
                        'sub-title text-teal-400 block text-xl md:text-xl'
                    }
                >
                    Developer
                </span>
            </Link>

            <button
                onClick={scrollTo}
                className={
                    'top-5 right-6 md:right-8 fixed text-2xl md:text-3xl hover:text-teal-400 transition-colors duration-300'
                }
                ref={contactRef}
            >
                <span className={'mori'}>Contact</span>
            </button>
        </>
    );
}
