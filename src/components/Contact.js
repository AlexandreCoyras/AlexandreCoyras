import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import {useEffect, useState} from "react";
gsap.registerPlugin(ScrollTrigger);



export default function Contact() {

    useEffect(() => {
        gsap.to(".contact", {
            scrollTrigger: {
                trigger: ".contact",
                start: "top 70%"
            },
            duration: 2,
            translateY: 0,
            ease: "back.out(1.5)",
        });
    }, [])

    return <>
        <div className={"h-screen flex"}>
            <div className={"ml-14 md:ml-24 mt-24 "}>
                <div className={"text-4xl md:text-9xl pop overflow-hidden"}><span className={"inline-block contact"} style={{transform: "translateY(100%)"}}>CONTACT</span></div>
                <div className={"text-4xl md:text-9xl pop overflow-hidden"}><span className={"inline-block contact"} style={{transform: "translateY(100%)"}}>ME</span></div>
            </div>
        </div>
    </>
}