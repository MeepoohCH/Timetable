"use server"

import { redirect } from "next/navigation"

export async function loginAction(formData: FormData) {
    // const values = Object.fromEntries(formData.entries())
    const uname = formData.get("uname")?.toString() || "";
    const password = formData.get("password")?.toString() || "";

    if (!uname || !password) {
        throw new Error("Please fill in both username and password.");
    }

    if (uname === "admin" && password === "1234") {
        window.location.href = "/student";
    } else {
        throw new Error("Invalid username or password"); 
    }

}
