// components/searchbar.tsx
//import React from "react";

export default function Searchbar() {
    return (
    <><div className="w-full max-w-3xl mb-2">
            <div className="rounded-3xl bg-[#DEE4D6] px-4 py-3 flex items-center gap-4">
                <div className="flex-1">
                    <p className="text-xs font-semibold uppercase text-slate-950">
                        Selected Ingredients:
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2 text-slate-950">
                        (Your selected ingredients will appear here)
                    </div>
                </div>

                <button className="btn btn-warning btn-sm md:btn-md shrink-0 text-slate-950">
                    Search Recipes
                </button>
            </div>
        </div><div className="w-full max-w-3xl">
                <label className="input input-bordered rounded-full w-full flex items-center gap-3 h-12 px-6 bg-[#DEE4D6]">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 opacity-70"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="black"
                        strokeWidth="2"
                    >
                        <circle cx="11" cy="11" r="7" />
                        <line x1="16.65" y1="16.65" x2="21" y2="21" />
                    </svg>

                    <input type="text" className="grow placeholder:text-slate-950" placeholder="Search recipes or ingredients..." />
                </label>
            </div></>
    );
}