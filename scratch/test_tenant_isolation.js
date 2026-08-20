(async () => {
    // 1. Register a new user (captures their companyId)
    const email = `hacker_${Date.now()}@example.com`;
    const registerRes = await fetch("http://localhost:8080/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            companyName: "Hacker Corp",
            email: email,
            password: "HackerPassword123!"
        })
    });
    const registerJson = await registerRes.json();
    const token = registerJson.access_token;
    
    // Fetch profile to get companyId reliably
    const meRes = await fetch("http://localhost:8080/api/v1/auth/me", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    });
    const meJson = await meRes.json();
    const companyId = meJson.companyId;
    console.log("Extracted companyId:", companyId);
    
    // 2. Fetch OTHER-companyId IDPs -> Expect 403
    // Use the known primaryCompany ID from the DB
    const otherCompanyId = "9e0a8d0e-6353-4ff5-955b-30da74cfbba6";
    const res403 = await fetch(`http://localhost:8080/api/v1/companies/${otherCompanyId}/idps`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    });
    console.log("Status for OTHER-companyId:", res403.status);
    console.log("Body for OTHER-companyId:", await res403.text());
    
    // 3. Fetch OWN-companyId IDPs -> Expect 200
    const res200 = await fetch(`http://localhost:8080/api/v1/companies/${companyId}/idps`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    });
    console.log("Status for OWN-companyId:", res200.status);
    console.log("Body for OWN-companyId:", await res200.text());
})();
