# Modern Anime Watchlist

A sleek, high-performance web app for tracking, discovering, and managing anime. Stylish, intuitive, and powered by the free **Jikan API**.

---

## Features

- **Jikan API Integration:** Fetch rich, real-time anime data from MyAnimeList using the Jikan API.
- **Complete Watchlist Management:** Add, move, and manage anime across three categories—**Watching**, **Completed**, and **Plan to Watch**. Your progress and preferences are saved using localStorage.
- **Ongoing Anime Section (Default Landing):** Discover currently airing anime from the latest season with broadcast schedules, **AIRING** badges, and trending indicators. Never miss an episode!
- **Adult Content Filter:** Toggle to show/hide ecchi/hentai anime across all sections. Preferences are saved, with clear messaging and a quick toggle for mature content visibility.
- **Debug Logging:** Improved diagnostics for tracking content loading, ensuring the ongoing section is always up-to-date.
- **Engaging UI Animations:**
  - **Card Scaling & 3D Rotation:** Hover over anime cards to see scaling, rotation, and shine effects for immersive depth.
  - **Color Schemes:** Bold and modern **black, red, and white** styling throughout the app.
  - **Animated Loading Component:** Displays responsive bouncing dots when loading data.
  - **Overlay Effects:** Interactive overlays for a polished, modern experience.
  - **Pulsing Badges:** "AIRING" status and schedule info use pulsing animation effects.
- **Adult Content Messaging:** Clearly informs users when content is filtered, with a quick toggle to enable mature content.
- **Persistent Data:** All watchlist, settings, and filter choices are saved locally for a seamless experience.
- **Clickable Cards & Modals:**
  - Anime cards open detailed modals that show synopsis, genres, studio details, member count, and more.
  - Cards feature smooth image loading (with fallback), interactive transforms, and info-rich overlays.

---

## Watchlist Categories

| Category         | Description                                   |
|------------------|-----------------------------------------------|
| **Watching**     | Currently watching anime                      |
| **Completed**    | Anime you've finished                         |
| **Plan to Watch**| Future anime you're interested in            |
| **Ongoing**      | Currently airing seasonal anime (default page)|

---

## Ongoing Anime (Seasonal Picks)

- Auto-fetches airing anime using Jikan's seasons endpoint.
- Each card displays a bold **AIRING** badge, pulsing animation, and next broadcast time.
- Filter mature content with a single click and see clear notifications when content is hidden.

---

## Usage Overview

1. Browse ongoing anime (default tab) with real-time broadcast info.
2. Add favorites to your Watchlist: choose from **Watching**, **Completed**, or **Plan to Watch**.
3. Use the adult filter toggle to customize browsing experience.
4. Click anime cards for full details—synopsis, genres, studio, popularity, member count, and more.
5. Enjoy smooth loading, modern color transitions, immersive card interactions, and persistent data storage.

---

## Tech Stack

- **Frontend:** Modern JS/React (or your preferred framework)
- **Data:** Jikan API for all anime data
- **Persistence:** localStorage stores watchlist and filter settings
- **Design:** CSS/SCSS with black, red, and white palette
- **Animations:** Scale, 3D rotate, overlays, shine effects, pulsing badges

---

## Screenshots

<img width="1920" height="1965" alt="screencapture-localhost-3000-2025-08-28-16_22_34" src="https://github.com/user-attachments/assets/5d2ebbdc-930c-4a5b-b7f8-78df8b2b8ca8" />


---

## Contributing

Open issues and pull requests for bugs, features, or enhancements.  
Please provide detailed logs when reporting ongoing section or filter behavior.

---

## License

MIT
