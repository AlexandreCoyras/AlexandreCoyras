import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useEffect, useRef } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.defaults({
    toggleActions: 'play pause resume reset',
});

export default function Contact() {
    const wantToRef = useRef(null);

    const mailRef = useRef(null);
    const arrowRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(
            '.contact',
            {
                y: 200,
            },
            {
                scrollTrigger: {
                    trigger: '.contact',
                    start: 'top 115%',
                },
                duration: 2,
                y: 0,
                ease: 'back.out(1.4)',
                overwrite: 'auto',
            }
        );

        gsap.fromTo(
            wantToRef.current,
            {
                opacity: 0,
                y: 100,
            },
            {
                scrollTrigger: {
                    trigger: wantToRef.current,
                    start: 'top 110%',
                },
                duration: 2,
                opacity: 1,
                ease: 'power1.out',
                y: 0,
            }
        );

        gsap.fromTo(
            mailRef.current,
            {
                opacity: 0,
                x: -300,
            },
            {
                scrollTrigger: {
                    trigger: mailRef.current,
                    start: 'top 100%',
                    end: 'top 100px',
                },
                duration: 2,
                opacity: 1,
                ease: 'power1.out',
                x: 0,
            }
        );
        gsap.fromTo(
            arrowRef.current,
            {
                opacity: 0,
                x: 300,
            },
            {
                scrollTrigger: {
                    trigger: arrowRef.current,
                    start: 'top 110%',
                },
                duration: 2,
                opacity: 1,
                ease: 'power1.out',
                x: 0,
            }
        );
    }, []);

    return (
        <>
            <div className={'h-screen  w-screen relative pop'}>
                <div className={'flex'}>
                    <div className={'ml-10 lg:ml-40 mt-28 '}>
                        <div
                            className={
                                'text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl overflow-hidden'
                            }
                        >
                            <span className={'inline-block contact'} style={{}}>
                                CONTACT
                            </span>
                        </div>
                        <div
                            className={
                                'text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl overflow-hidden'
                            }
                        >
                            <span className={'inline-block contact'} style={{}}>
                                ME
                            </span>
                        </div>
                    </div>
                </div>
                <div className={'flex justify-center items-center'}>
                    <div
                        className={
                            'text-2xl sm:text-3xl md:text-4xl font-bold translate-x-10 md:translate-x-1/3 lg:translate-x-3/4 mt-32 md:mt-16'
                        }
                        ref={wantToRef}
                    >
                        Want to work with me?
                    </div>
                </div>
                <div
                    className={
                        'flex flex-col h-1/2 md:h-96 absolute bottom-0 w-full block-hitbox justify-center'
                    }
                >
                    <div ref={mailRef}>
                        <div
                            className={
                                'highlight absolute h-0 w-3 left-0 top-0 bg-teal-400 transition-all duration-500 ease-in-out'
                            }
                        />
                        <div className={'ml-6 mt-12 mb-12'}>
                            <div className={'text-xl sm:text-2xl'}>
                                Send me a message
                            </div>
                            <Link href={'mailto:alexandrecoyras@gmail.com'}>
                                <div
                                    className={
                                        'text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl ml-4 mt-8'
                                    }
                                >
                                    <div>ALEXANDRECOYRAS</div>
                                    <div className={'flex flex-row'}>
                                        <div className={'text-teal-400'}>@</div>
                                        <div>GMAIL.COM</div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div
                        className={
                            'hidden lg:flex right-20 block absolute h-auto text-teal-400 '
                        }
                        ref={arrowRef}
                    >
                        <FiArrowLeft size={120} />
                    </div>
                </div>
            </div>
        </>
    );
}
