export const order = async (
  id: string,
  pickUp: string,
  destination: string,
  status: "pending" | "in-transit" | "completed" | "cancelled",
  customer: any
) => {
  try {
    const res = await fetch(``, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, pickUp, destination, status, customer }),
    });
    return res.json();
  } catch (error) {
    console.log("Error fetching data", error);
    throw new Error("Network error");
  }
};


