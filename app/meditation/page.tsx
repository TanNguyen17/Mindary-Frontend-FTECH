"use client";

import React, { useEffect } from "react";
import MeditationLibrary from "@/components/meditation/MeditationLibrary";
import useAuthStore from "@/hooks/useAuthStore";
import { useRouter } from "next/navigation";
import Header from "@/components/general/Header";

export default function Meditation() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
    const router = useRouter();
    const accessToken = useAuthStore((state) => state.accessToken);
    console.log("accessToken", accessToken);
    // Redirect to login page
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login')
        }
    }, [isAuthenticated, router])

    // Prevent rendering while redirecting
    if (!isAuthenticated) {
        return null
    }

    return (
        <>
            <Header page={"Meditation"} />
            <div className="flex flex-col gap-8">
                {/* <div className="p-4 bg-primary rounded-lg shadow-md">
                <h2 className="text-white text-3xl font-bold text-center">Meditation library</h2>
            </div> */}

                <MeditationLibrary accessToken={accessToken} />
            </div>
        </>
    );
}