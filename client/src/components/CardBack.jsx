import { useState } from "react";
import { SunIcon } from "@heroicons/react/24/solid";

export default function CardBack({color}) {
    return (
        <div
            className="bg-white border-black w-20 h-32 rounded-lg shadow-xl border flex flex-col justify-center items-center select-none"
        >
            <SunIcon
                className={`
                        size-12
                        ${color === "red" ? "text-red-400" : "text-blue-400"}
                    `}
            />
        </div>
    );
}