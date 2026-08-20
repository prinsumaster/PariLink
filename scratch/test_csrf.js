(async () => {
    // 1. Login
    const res = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "admin@parilink.com", password: "password123" })
    });
    
    let cookies = res.headers.getSetCookie();
    let cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');

    // 2. GET request to trigger CSRF cookie generation
    const getRes = await fetch("http://localhost:8080/api/v1/auth/me", {
        method: "GET",
        headers: { "Cookie": cookieHeader }
    });
    
    const getCookies = getRes.headers.getSetCookie();
    cookies = cookies.concat(getCookies);
    cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');
    
    const xsrfCookie = cookies.find(c => c.startsWith('XSRF-TOKEN='));
    const csrfToken = xsrfCookie ? xsrfCookie.split(';')[0].split('=')[1] : '';
    
    // 3. 403 test (no CSRF token)
    const res403 = await fetch("http://localhost:8080/api/v1/auth/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Cookie": cookieHeader
        }
    });
    console.log("Status without CSRF:", res403.status); // Expect 403
    
    // 4. 200 test (with CSRF token)
    const res200 = await fetch("http://localhost:8080/api/v1/auth/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Cookie": cookieHeader,
            "x-xsrf-token": decodeURIComponent(csrfToken)
        }
    });
    console.log("Status with CSRF:", res200.status); // Expect 200
})();
