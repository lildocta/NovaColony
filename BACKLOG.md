# NovaColony Feature Backlog

This document outlines the roadmap for the NovaColony space simulation game.

## 🔒 Core Systems

### Universal Authentication System
**Goal:** Create a persistent user session that controls access to sensitive ship systems.
- [ ] **Auth Context:** Create `AuthContext` to manage current user session (User, Admin, Guest) and persist permissions across all programs.
- [ ] **Login Program:** A dedicated interface for entering credentials.
    - *Feature:* Hacking mini-game to bypass forgotten passwords?
- [ ] **Program Gating:** Modify `Launcher` to lock programs based on authentication level (e.g., "Reactor Control" requires `Level 5 Clearance`).
- [ ] **Session Persistence:** Save login state to `GameContext` so it survives browser refreshes.

### Notification System
**Goal:** Provide feedback to the user from the ship's OS.
- [ ] **Toast/Alert System:** "Access Denied", "Power Low", "New Message Received".
- [ ] **Heads-Up Display (HUD):** Persistent status bar showing hull integrity, fuel, and alerts.

---

## 🚀 Navigation & Helm

### Star Map Module
**Goal:** Allow the user to visualize their location and plot courses.
- [ ] **3D/2D Map Visualization:** Render nodes (stars/planets) and connections.
- [ ] **Course Plotting:** Select a destination and calculate fuel costs.
- [ ] **Warp Drive Interface:** A mini-game or sequence to initiate a jump (aligning frequencies, charging capacitors).

### Thruster Control
**Goal:** Fine-grained movement for docking or evasion.
- [ ] **Manual Override:** UI for manual vector inputs.
- [ ] **Docking Procedure:** Aligning with station docking ports.

---

## ⚡ Engineering & Power

### Reactor Core Manager
**Goal:** Manage and distribute limited energy resources.
- [ ] **Power Distribution:** Sliders to allocate power between Engines, Shields, and Life Support.
- [ ] **Overheat Mechanic:** Running systems at >100% generates heat; users must vent heat or risk damage.

### Shield Generator
**Goal:** Defensive system management.
- [ ] **Frequency Modulation:** Adjust shield harmonics to match incoming damage types.
- [ ] **Sector Control:** Reinforce Forward/Aft/Port/Starboard shields.

---

## 📡 Communications & Data

### Comms Array
**Goal:** Interact with outside entities.
- [ ] **Inbox:** Read messages from command or distress beacons.
- [ ] **Decryption:** Mini-game to decode scrambled alien/enemy signals.
- [ ] **Long-range Scanner:** Detect nearby anomalies.

### Ship Logs (Terminal)
**Goal:** Storytelling and information gathering.
- [ ] **Command Line Interface (CLI):** A retro-style terminal for querying ship logs and finding lore/passwords.
- [ ] **Audio Logs:** Playable voice recordings from the previous crew.

---

## 🧬 Life Support

### Environmental Control
**Goal:** Keep the crew alive.
- [ ] **Atmosphere Monitor:** Oxygen/CO2 levels balance.
- [ ] **Temperature Control:** Manage sectoral heating/cooling.
- [ ] **Hydroponics:** Managing food/oxygen generation.

---

## 🛠 Polish & Immersion

- [ ] **Sound Effects:** UI clicks, ambient engine hum, alarms.
- [ ] **Boot Sequence:** A cinematic startup sequence when the "Game" loads.
- [ ] **Visual Glitches:** Screen artifacts when the ship executes a warp jump or takes damage.
