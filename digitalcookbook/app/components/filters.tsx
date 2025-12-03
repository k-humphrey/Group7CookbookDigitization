"use client";
import { useState } from "react";
export default function Filters() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <section>
      {/* Filters */}
      <div
        className={`mt-6 collapse collapse-arrow bg-gray-200 border-base-300 border mx-3 ${
          isOpen ? "collapse-open" : "collapse-close"
        }`}
      >
        
        <div
        className="collapse-title font-semibold after:start-5 after:end-auto pe-4 ps-12 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        >
          Filters
        </div>
        <div className="collapse-content text-sm ml-2">
          <div className="h-200">
            {/* Filter 1: Kitchen Appliances */}
            <div>
              <h3 className="font-semibold text-xs uppercase mb-2">Kitchen Appliances</h3>
              <div className="flex flex-col gap-1">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="checkbox checkbox-xs" />
                  <span>Oven</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="checkbox checkbox-xs" />
                  <span>Air Fryer</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="checkbox checkbox-xs" />
                  <span>Slow Cooker</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="checkbox checkbox-xs" />
                  <span>Microwave</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="checkbox checkbox-xs" />
                  <span>Stockpot/Dutch oven</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="checkbox checkbox-xs" />
                  <span>Skillet/frying pan</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="checkbox checkbox-xs" />
                  <span>Saucepan with lid</span>
                </label>
              </div>
            </div>

            {/* Filter 2: Blue Ribbon */}
            <div>
              <h3 className="font-semibold text-xs uppercase my-2">Health</h3>
              <div className="flex flex-col gap-1">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="checkbox checkbox-xs" />
                  <span>Blue ribbon</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="checkbox checkbox-xs" />
                  <span>Vegan</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="checkbox checkbox-xs" />
                  <span>Vegetarian</span>
                </label>
              </div>
            </div>

            {/* Filter 3: N/A */}
            <div>
              <h3 className="font-semibold text-xs uppercase my-2">Filter 3</h3>
              <div className="flex flex-col gap-1">
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}