const rider = async () => {
  try {
    const res = await fetch(``, {
      method: "GET",
      headers: { "Content-Type": "application" },
      body: JSON.stringify({}),
    });

    return res.json();
  } catch (error) {
    console.log("Error fetching data: ", error);
    throw new Error("Network error");
  }
};
