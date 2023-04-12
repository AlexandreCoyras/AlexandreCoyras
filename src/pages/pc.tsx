import {useState} from "react";

export default function PcHome() {
    const [counter, setCounter] = useState(0)

    return (<>
            <div className={"w-full h-full"}>
        <div className={"text-center mt-10"}>
            My projects
        </div>
                <div className={"text-center mt-20"}>
                    <span>You will find my projects here soon, comeback later please</span>
                    {/*<button className={"text-3xl mt-32"} onClick={() => setCounter((c) => c+1) }>{counter}</button>*/}
                </div>
            </div>
        </>
    );
};