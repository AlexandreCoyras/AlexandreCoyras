import {useState} from "react";

export default function PcHome() {
    const [counter, setCounter] = useState(0)

    return (<>
            <div className={"w-full h-full m-3"}>
        <div className={"text-center mt-10"}>
            Site under construction, comeback later please
        </div>
                <div className={"text-center"}>
                    <button className={"text-3xl mt-32"} onClick={() => setCounter((c) => c+1) }>{counter}</button>
                </div>
            </div>
        </>
    );
};