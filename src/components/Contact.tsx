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
            <div className={'pop  relative h-screen w-screen'}>
                <div className={'flex'}>
                    <div className={'ml-10 mt-28 lg:ml-40 '}>
                        <div
                            className={
                                'overflow-hidden text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl'
                            }
                        >
                            <span className={'contact inline-block'} style={{}}>
                                CONTACT
                            </span>
                        </div>
                        <div
                            className={
                                'overflow-hidden text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl'
                            }
                        >
                            <span className={'contact inline-block'} style={{}}>
                                ME
                            </span>
                        </div>
                    </div>
                </div>
                <div className={'flex items-center justify-center'}>
                    <div
                        className={
                            'mt-32 translate-x-10 text-2xl font-bold sm:text-3xl md:mt-16 md:translate-x-1/3 md:text-4xl lg:translate-x-3/4'
                        }
                        ref={wantToRef}
                    >
                        Want to work with me?
                    </div>
                </div>
                <div
                    className={
                        'block-hitbox absolute bottom-0 flex h-1/2 w-full flex-col justify-center md:h-96'
                    }
                >
                    <div ref={mailRef}>
                        <div
                            className={
                                'highlight absolute left-0 top-0 h-0 w-3 bg-teal-400 transition-all duration-500 ease-in-out'
                            }
                        />
                        <div className={'mb-12 ml-6 mt-12'}>
                            <div className={'text-xl sm:text-2xl'}>
                                Send me a message
                            </div>
                            <Link href={'mailto:alexandrecoyras@gmail.com'}>
                                <div
                                    className={
                                        'ml-4 mt-8 text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl'
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
                            'absolute right-20 block hidden h-auto text-teal-400 lg:flex '
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
