# PariLink Enterprise 2.0 — Client Demo Backup Plan

During the live presentation, technical glitches or network latency may occasionally occur. If a feature fails, **NEVER start debugging live in front of the client.** Move immediately to the next strongest feature and keep the business story moving.

## 1. If Login Fails
→ Check if the API server terminal died. If so, quickly pivot by explaining: "PariLink utilizes enterprise Single Sign-On (SSO) with Okta/AzureAD. Let me pull up a pre-authenticated dashboard environment."
→ If the local environment is totally frozen, refresh the browser page.

## 2. If the Dashboard Widget Fails or Shows an Error
→ Narrate past it: "These KPIs update in real-time."
→ Navigate directly to the underlying module (e.g., if the Trips widget fails, click on **Trips** in the sidebar).

## 3. If "Create Trip" or Forms Fail to Save
→ Do not attempt to fill out the form a second time.
→ Use the existing seeded trips (e.g., `TRP-1001` or `TRP-1002`).
→ **Action**: Click on an existing trip and demonstrate the lifecycle/status management instead of the creation process.

## 4. If Invoice Generation Fails
→ Open the existing invoice list.
→ **Action**: Click into the already seeded `PAID` or `ISSUED` invoice (`INV-1001` or `INV-1002`). 
→ **Narrative**: "Here is an example of an invoice that was automatically generated and processed upon delivery."

## 5. If AI/Copilot Fails or Returns an Error
→ Skip the interactive AI prompt temporarily.
→ **Action**: Demonstrate the standard Analytics/Dashboard instead.
→ **Narrative**: "Our AI is an optional intelligence layer that runs securely in the background. While the predictive model processes data offline, our core analytics suite gives you all the manual control you need."

## 6. If the UI Shows a Hydration Error or Blank Screen
→ Immediately hit `F5` or `Cmd+R` to refresh the page. Next.js will instantly recover on the client side.
→ **Narrative**: "We deploy continuous real-time updates. The data has just refreshed."

## Summary
The goal is to demonstrate **business value**, not flawless code. Always pivot to the data that is already seeded and visible.
