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

export const confirmCarrierAcceptance = async (token: string, shipmentId: number, acceptanceId: number) => {
  try {
    const res = await fetch(`${apiUrl}/api/shipments/${shipmentId}/acceptances/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ acceptance_id: acceptanceId })
    });
    return res.json();
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

export const getShipmentDetails = async (token: string, shipmentId: number) => {
  try {
    const res = await fetch(`${apiUrl}/api/shipments/${shipmentId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    return res.json();
  } catch (error: any) {
    console.log("Error fetching shipment details:", error);
    throw error;
  }
}
