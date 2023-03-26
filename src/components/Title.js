import Link from "next/link";
import gsap from 'gsap'
import dynamic from "next/dynamic";
import { ScrollToPlugin } from "gsap/dist/ScrollToPlugin";
gsap.registerPlugin(ScrollToPlugin)


export default function Title () {

    function scrollTo() {
        gsap.to(window, {duration: 2.5, scrollTo: window.innerHeight});
    }

    return <>
        <Link href={"/"} className={"top-4 left-6 md:left-8 title fixed text-2xl md:text-3xl"}>
            <span className={"text-teal-400"}>A</span>
            lexandre Coyra
            <span className={"text-teal-400"}>s</span>
            <br/>
            <span className={"sub-title text-teal-400 block text-xl md:text-xl"}>Developer</span>
        </Link>

        <button onClick={scrollTo} className={"top-5 right-6 md:right-8 fixed text-2xl md:text-3xl"}>
            <span className={"mori"}>Contact</span>
        </button>
    </>

}