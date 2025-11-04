# AxGrid Frontend Challenge

A dynamic, real-time interface for the AxGrid energy trading platform, built as a technical assessment.

## Tech Stack

* **Framework:** React 19 (via Vite)
* **Language:** TypeScript
* **State Management:** Zustand
* **Routing:** React Router DOM
* **Real-time Comms:** Socket.io-client
* **Styling:** CSS Modules
* **Linting/Formatting:** ESLint + Prettier

## Running the Project

1.  **Backend Setup:**
    ```bash
    cd api
    npm install
    npm run dev:all
    ```
    REST API will be available at `http://localhost:3000`
    WebSocket will be available at `http://localhost:4001`

2.  **Frontend Setup:**
    ```bash
    npm install
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or a similar port).\

## Running the Tests
The project includes a comprehensive test suite covering both unit logic and end-to-end user flows.

Prerequisite: Ensure the backend server is running (`npm run dev:all` in the `api` folder).
```bash
# Run all Unit Tests (Vitest)
npm run test

# Run all End-to-End Tests (Playwright, headless)
npm run test:e2e

# Run End-to-End Tests in UI Mode (Interactive)
npm run test:e2e:ui
```

**Testing Strategy**

The project’s testing strategy combines Unit and E2E tests to cover both isolated logic and critical user flows.

* **Unit Tests (Vitest):**
    Used to validate complex, pure logic encapsulated within custom hooks. This approach is fast, reliable, and allows for isolated testing of business rules.
    * **`useFilteredOffers`:** Covers all filtering permutations, including the "zombie row" edge case.
    * **`useRowFlash`:** Verifies the correct animation state is returned based on timestamp and status changes, using mocked timers

* **End-to-End Tests (Playwright):**
    Used to simulate real user scenarios, ensuring all components, hooks, and stores integrate correctly to deliver the intended functionality.
    * **`market.spec.ts`:** Applies a filter, clicking "Trade," verifying the "flash" animation, and confirming the "zombie row" logic (animation persistence) works as expected.
    * **`sell-energy.spec.ts`:** Verifies that the dynamic form renders and updates its fields correctly based on API-driven keys.

## Core Features

* **Dynamic Form:** A form page that dynamically renders fields based on the `/api/energy-offerings` config.
* **Real-Time Market:**
    * WebSocket-powered data table for live market offers.
    * Dual filters (by Source and Status) with **URL state persistence**.
    * **UI "Flash" Indicators** for `created`, `updated`, and `completed` events (abstracted into a custom hook).
    * Offer details inspection via a clean, reusable modal.
    * Robust state management to prevent unnecessary re-renders.

## Architectural Decisions

**1. State Management: Zustand**

 * **Avoids Unnecessary Re-renders:** React Context re-renders all consuming components whenever any part of the state object changes. For a high-frequency WebSocket stream, this is an inefficient performance bottleneck.
 * **Selective Subscriptions:** Zustand allows components to select only the slices of state they need (e.g., `const offers = useMarketStore(state => state.offers))`. Components that only need actions (like `setOfferStatus`) will not re-render when the data changes, drastically improving performance.
 * **No Wrapper Provider:** Zustand does not require wrapping the entire application in a `<MyProvider>` component. The store is a simple hook (`useMarketStore`) that can be imported and used as needed, leading to a cleaner component tree.
 * **Non-React Logic:** It provides a clean way to manage non-React logic (like the persistent WebSocket connection) outside of the component lifecycle

**2. Filter State Persistence: URL Params**

* **Solves All Use Cases:** Sharable, bookmarkable, refresh persistance and history navigation.
* **Encapsulation:** All this logic (reading from and writing to the URL) was encapsulated within the `useMarketFilters` hook, so the `MarketPage` component remains completely unaware of `useSearchParams`.

**3. CSS Modules**

Given the project's well-defined scope and relatively simple UI, adding a large third-party styling library was deemed unnecessary overhead.

* CSS Modules are supported natively by Vite with zero setup cost.
* They provide the primary benefit we needed: scoped class names out-of-the-box, eliminating any risk of global style collision.
* No runtime performance penalty (unlike many CSS-in-JS libraries) and maintains a clean separation of concerns between component structure and styles, which aligns with the project's goal of clean, readable code.

**4. WebSocket-First Data Fetching Strategy**

A deliberate decision was made to handle all market data retrieval exclusively through the WebSocket connection. The static REST endpoints (`GET /api/orders` and `GET /api/orders/:id`) provided by the backend API were intentionally not used.

This approach was chosen for the following reasons:

* **Real-Time as the Single Source of Truth:** The primary requirement of the task is "real-time." This strategy establishes the WebSocket as the single source of truth from the moment the user connects. By listening for the `offers:init` event, we receive the complete initial state directly from the live source.
* **Eliminates Synchronization Complexity:** This "push-first" pattern completely avoids the complex logic and potential race conditions that would arise from fetching a static REST list and then trying to "stitch" or synchronize it with a separate, live data stream.
* **Reduces Redundancy:** The `offers:init` event provides the full data set, making a separate HTTP `fetch` to `GET /api/orders` for the same data redundant.
* **Performance & Efficiency:** For the "Details" modal, the live offer object received from the WebSocket stream already contained all necessary data (including `location`, `timestamps`, etc.). Bypassing `GET /api/orders/:id` prevents an unnecessary network request on every modal open, resulting in a faster and more responsive UI.

**5. The "Zombie Row" Fix**

A "zombie row" logic was implemented to solve a critical UX bug. 
Problem explanation: When a user filtered by `status` and clicked on "Trade", the row's status changed to completed. The filter instantly removed the row from the DOM before the flashCompleted animation could play. The user's action had no visual feedback.

We "lie" to the filter for 1.2 seconds. `MarketPage` tracks the `justCompletedId` and passes it to `useFilteredOffers`, which is programmed to keep that row visible (even if it doesn't match the filter) just long enough for the `useRowFlash` animation to complete. This provides critical user feedback.

**6. Global Error Handling: Decoupled Stores**
* **Decision:** A separate `useError` store was created to handle global UI state, rather than placing this logic inside the `marketStore`.
* **Justification:** This prevents coupling domain state (market data) with UI state (error banners).

`marketStore` is responsible only for market data.
`useError` is responsible only for UI state.

`App.tsx` acts as a Mediator. It listens to both stores. When `marketStore` reports an internal `connectionStatus: 'error'`, `App.tsx` tells `useError` to `setGlobalError(...)`. This keeps the stores decoupled and reusable.
