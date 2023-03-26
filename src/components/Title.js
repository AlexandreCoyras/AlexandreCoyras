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
        <Link href={"/"} className={"top-4 left-8 absolute title"}>
            <span className={"text-teal-400"}>A</span>
            lexandre Coyra
            <span className={"text-teal-400"}>s</span>
            <br/>
            <span className={"sub-title text-teal-400 block"}>Developer</span>
        </Link>

        <button onClick={scrollTo} className={"top-4 right-8 absolute text-2xl  font-bold"}>
            <span className={"mori"}>Contact</span>
        </button>
    </>

}