"use client";
import React, { useState } from "react";
import { format, startOfWeek, addDays } from "date-fns";
import { atom, useAtom, useAtomValue } from "jotai";
import useUserStore from "@/hooks/useUserStore";

const Calendar = () => {
    const today = new Date();
    const startWeek = startOfWeek(today, { weekStartsOn: 1 });
    const selectedDate = useUserStore((state) => state.selectedDate);
    const setSelectedDate = useUserStore((state) => state.setSelectedDate)

    const days = Array.from({ length: 7 }).map((_, i) => addDays(startWeek, i));

    const handleDayClick = (date: string) => {
        setSelectedDate(date);
    };


    return (
        <div className="flex flex-col items-center my-4 w-full pb-3">
            <div className="grid grid-cols-7 w-full gap-1">
                {days.map((day, index) => {
                    const dayKey = format(day, "yyyy-MM-dd");
                    return (
                        <div
                            key={index}
                            onClick={() => {
                                handleDayClick(dayKey);

                            }}
                            className={`px-2 py-2 text-center rounded-lg cursor-pointer
                                ${dayKey === selectedDate ? "bg-primary font-bold text-white" : "bg-gray-200 text-gray-800"}
                                ${dayKey !== selectedDate && "hover:bg-gray-300"}`}
                        >
                            {format(day, "EEE")}
                            <br />
                            {format(day, "dd")}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Calendar;
