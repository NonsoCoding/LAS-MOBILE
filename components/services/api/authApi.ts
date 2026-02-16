export const apiUrl = "https://web-production-4a8a5.up.railway.app";

export const loginUser = async (email: string, password: string) => {
  try {
    // Try with /api/ prefix to match your other endpoints
    const res = await fetch(`${apiUrl}/api/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const responseData = await res.json();
    console.log("Login API response:", responseData);

    return responseData;
  } catch (error: any) {
    console.log("Error logging in:", error);
    throw error;
  }
};

export const registeredUser = async (data: FormData) => {
  try {
    console.log("Registration data being sent:", data); // Debug log

    const res = await fetch(`${apiUrl}/api/auth/register/`, {
      method: "POST",
      body: data,
    });

    const responseData = await res.json();
    console.log("Registration response:", responseData); // Debug log

    if (!res.ok) {
      throw new Error(
        responseData.message || `HTTP error! status: ${res.status}`
      );
    }

    return responseData;
  } catch (error: any) {
    console.log("Error registering user:", error);
    throw error;
  }
};

export const createShippment = async (data: FormData | any, token: string) => {
  try {
    
    console.log("Data being sentL: ", data);
    // Determine if we're sending FormData or JSON
    const isFormData = data instanceof FormData;

    const headers: HeadersInit = isFormData
      ? {
          // Don't set Content-Type for FormData - let the browser set it with boundar
          Authorization: `Bearer ${token}`,
        }
      : {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

    const body = isFormData ? data : JSON.stringify(data);

    const res = await fetch(`${apiUrl}/api/shipments/create-full/`, {
      method: "POST",
      headers: headers,
      body: body,
    });

    const responseData = await res.json();
    console.log("Create shipment response:", responseData); // Debug log

    if (!res.ok) {
      throw new Error(
        responseData.message || `HTTP error! status: ${res.status}`
      );
    }

    return responseData;
  } catch (error: any) {
    console.log("Error creating shipment:", error);
    throw error;
  }
}

export const offerPrice = async (id: any, data: { final_price: string; payment_method: string }, token: string) => {
  try {
    const res = await fetch(`${apiUrl}/api/shipments/${id}/offer/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    const responseData = await res.json();
    console.log("Offer price response:", responseData); // Debug log
    return responseData;
  } catch (error: any) {
    console.log("Error offering price:", error);
    throw error;
  }
}

export const forgottenPassword = async (email: string) => {
  try {
    const res = await fetch(`${apiUrl}/api/auth/password-reset/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const responseData = await res.json();
    console.log("Password reset response:", responseData); // Debug log

    if (!res.ok) {
      throw new Error(
        responseData.message || `HTTP error! status: ${res.status}`
      );
    }

    return responseData;
  } catch (error: any) {
    console.log("Error sending password reset:", error);
    throw error;
  }
};

export const ConfirmPasswordReset = async (
  otp: string,
  password: string,
  passwordConfirm: string
) => {
  try {
    const payload = {
      otp,
      password,
      password_confirm: passwordConfirm,
    };

    console.log("Sending password reset payload:", payload); // Debug log

    const res = await fetch(`${apiUrl}/api/auth/password-reset/confirm/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const responseData = await res.json();
    console.log("Password reset confirm response:", responseData); // Debug log
    console.log("Response status:", res.status); // Debug log

    if (!res.ok) {
      // Log the full error details
      console.error("Password reset error details:", responseData);
      throw new Error(
        responseData.message ||
          responseData.error ||
          JSON.stringify(responseData) ||
          `HTTP error! status: ${res.status}`
      );
    }

    return responseData;
  } catch (error: any) {
    console.log("Error confirming password reset:", error);
    throw error;
  }
};

export const verifyOtp = async (otp: string) => {
  try {
    const res = await fetch(`${apiUrl}/api/auth/verify-email/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp }),
    });
    const responseData = await res.json();
    console.log("Verify OTP response:", responseData);
    return responseData;
  } catch (error: any) {
    console.log("Error verifying OTP:", error);
    throw error;
  }
};

export const resendOtp = async (email: string) => {
  try {
    const res = await fetch(`${apiUrl}/api/auth/resend-verification/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const responseData = await res.json();
    console.log("Resend OTP response:", responseData);

    return responseData;
  } catch (error: any) {
    console.log("Error resending OTP:", error);
    throw error;
  }
};

export const getUserProfile = async (token: string) => {
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
    console.log("Error getting user profile:", error);
    throw error;
  }
};

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const res = await fetch(`${apiUrl}/api/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    const responseData = await res.json();
    console.log("Token refresh response:", responseData);

    if (!res.ok) {
      throw new Error(
        responseData.message || `HTTP error! status: ${res.status}`
      );
    }

    return responseData;
  } catch (error: any) {
    console.log("Error refreshing token:", error);
    throw error;
  }
};

export async function saveIndemnityAcceptance() {
  // Example payload
  const payload = {
    indemnityAccepted: true,
    indemnityVersion: "v1.0",
    acceptedAt: new Date().toISOString(),
  };

  // Save to API / Firebase / Local Store
  console.log("Indemnity accepted:", payload);
}

export const checkCarrierExists = async (
  email: string
  // phone: string,
  // plate: string
) => {
  const res = await fetch(`${apiUrl}/api/auth/check-user/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      // phoneNumber: phone,
      // plateNumber: plate,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to check user");
  }

  return data.exists as boolean;
};
