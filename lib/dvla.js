export const fetchDVLAData = async (registrationNumber) => {
  const apiKey = process.env.DVLA_API_KEY;
  if (!apiKey) {
    console.error("❌ Missing DVLA API key");
    return {};
  }

  try {
    const res = await fetch("https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({ registrationNumber }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ DVLA API error:", res.status, errorText);
      return {};
    }

    const data = await res.json();
    console.log("✅ DVLA data fetched for", registrationNumber);
    return data; // return full object
  } catch (err) {
    console.error("❌ DVLA fetch failed:", err);
    return {};
  }
};