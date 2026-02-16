import { apiUrl } from "./authApi";


export const userProfile = async (token: string) => {
    try {
        const res = await fetch(`${apiUrl}/api/auth/profile/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const responseData = await res.json();
        console.log("User profile response:", responseData);

        if (!res.ok) {
            throw new Error(
                responseData.message || `HTTP error! status: ${res.status}`
            );
        }

        return responseData;
    } catch (error: any) {
        console.log("Error fetching user profile:", error);
        throw error;
    }
}