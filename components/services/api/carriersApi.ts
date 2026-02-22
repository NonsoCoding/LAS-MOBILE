import { apiUrl } from "./authApi";

export const requestShippments = async (token: string, page: number = 1, shipmentId?: number) => {
  try {
    let url = `${apiUrl}/api/shipments/carrier/requests/?page=${page}`;
    if (shipmentId) {
      url += `&shipment_id=${shipmentId}`;
    }
    console.log("Fetching shipments from:", url);
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await res.json();
    console.log("Shipments response status:", res.status);
    return data;
  } catch (error: any) {
    console.log("Error fetching shipments:", error.message || error);
    throw error;
  }
}

export const requestOfferPrice = async (token: string, shipmentId: number) => {
  try {
    const url = `${apiUrl}/api/shipments/${shipmentId}/acceptances/`;
    console.log("Fetching offers from:", url);
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    console.log("Offers response status:", res.status);
    const data = await res.json();
    console.log("Offers response:", data);
    return data;
  } catch (error: any) {
    console.log("Error fetching offers:", error.message || error);
    throw error;
  }
}

export const confirmCarrierAcceptance = async (token: string, shipmentId: number, carrierId: number) => {
  try {
    const res = await fetch(`${apiUrl}/api/shipments/${shipmentId}/select-carrier/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ carrier_id: carrierId })
    });
    
    const data = await res.json();
    if (!res.ok) {
      throw new Error(`Carrier selection failed: ${JSON.stringify(data)}`);
    }
    return data;
  } catch (error: any) {
    console.log("Error confirming carrier acceptance:", error);
    throw error;
  }
}

export const acceptRequest = async (token: string, id: string) => {
  try {
    const res = await fetch(`${apiUrl}/api/shipments/${id}/accept/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    return res.json();
  } catch (error: any) {
    console.log("Error fetching data", error);
    throw new Error("Network error");
  }
}

export const getShipmentDetails = async (token: string) => {
  try {
    const res = await fetch(`${apiUrl}/api/shipments/carrier/current/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  } catch (error: any) {
    // Silently throw to avoid spamming the console during polling, since 404 is expected while waiting
    throw error;
  }
}

export const getShipperCurrentShipments = async (token: string) => {
  try {
    const res = await fetch(`${apiUrl}/api/shipments/current/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      const errorData = await res.json().catch(() => ({}));
      throw new Error(`HTTP error! status: ${res.status}, data: ${JSON.stringify(errorData)}`);
    }
    return res.json();
  } catch (error: any) {
    console.log("Error fetching shipper current shipments:", error);
    throw error;
  }
}

export const getShipmentById = async (token: string, shipmentId: number | string) => {
  try {
    const res = await fetch(`${apiUrl}/api/shipments/${shipmentId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`HTTP error! status: ${res.status}, data: ${JSON.stringify(errorData)}`);
    }
    return res.json();
  } catch (error: any) {
    console.log(`Error fetching shipment ${shipmentId} details:`, error);
    throw error;
  }
}

export const updateShipmentStatus = async (token: string, shipmentId: number | string, newStatus: string) => {
  try {
    const res = await fetch(`${apiUrl}/api/shipments/${shipmentId}/status/`, {
      method: "PATCH", // Using PATCH as it's typically used for partial updates like status
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus })
    });
    
    const data = await res.json();
    if (!res.ok) {
      throw new Error(`Failed to update status: ${JSON.stringify(data)}`);
    }
    return data;
  } catch (error: any) {
    console.log(`Error updating status for shipment ${shipmentId}:`, error);
    throw error;
  }
}

export const updateCarrierProfile = async (token: string, data: any) => {
  try {
    const isFormData = data instanceof FormData;
    const headers: HeadersInit = isFormData
      ? {
          "Authorization": `Bearer ${token}`
        }
      : {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        };

    const body = isFormData ? data : JSON.stringify(data);

    const res = await fetch(`${apiUrl}/api/shipments/carrier/profile/`, {
      method: "PATCH",
      headers: headers,
      body: body
    });
    
    if (!res.ok) {
       const errorData = await res.json();
       throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
    }
    return res.json();
  } catch (error: any) {
    console.log("Error updating carrier profile:", error.message || error);
    throw error;
  }
}
 
export const getCarrierProfile = async (token: string) => {
  try {
    const res = await fetch(`${apiUrl}/api/shipments/carrier/profile/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    if (!res.ok) {
       const errorData = await res.json();
       throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
    }
    return res.json();
  } catch (error: any) {
    console.log("Error fetching carrier profile:", error.message || error);
    throw error;
  }
}

export const updateCarrierStatus = async (token: string, is_online: boolean) => {
  try {
    const res = await fetch(`${apiUrl}/api/shipments/carrier/status/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ is_online })
    });
    if (!res.ok) {
       const errorData = await res.json();
       throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
    }
    return res.json();
  } catch (error: any) {
    console.log("Error updating carrier status:", error.message || error);
    throw error;
  }
}

export const livetracking = async (token: string, shipmentId: string | number, latitude: number, longitude: number) => {
  if (!shipmentId) {
    console.error("livetracking: shipmentId is required");
    return;
  }
  try {
    const url = `${apiUrl}/api/shipments/${shipmentId}/location/`;
    console.log("Live tracking request URL:", url);
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ latitude, longitude })
    });
    
    if (!res.ok) {
       const errorData = await res.json().catch(() => ({}));
       console.error("Live tracking ERROR response:", JSON.stringify(errorData, null, 2));
       throw new Error(errorData.error || errorData.message || `HTTP error! status: ${res.status}`);
    }
    return res.json();
  } catch (error: any) {
    console.log("Error updating carrier location:", error.message || error);
    throw error;
  }
}
