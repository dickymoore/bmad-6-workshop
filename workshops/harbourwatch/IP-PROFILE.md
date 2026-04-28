# HarbourWatch IP Profile

## Identity

- Track id: `harbourwatch`
- Product/display name: HarbourWatch
- Product category: harbour-side situational awareness and operations display
- Setting: marina, harbour office, or ferry-terminal concourse
- Primary surface: shared public-and-ops display with optional local staff view

## Users

- Primary user: harbour, marina, or ferry-terminal staff who need a fast shared view of current operating conditions.
- Secondary user: visitors, passengers, berth holders, and local operators who need calm, plain-language awareness before moving around the harbour.
- Operator user: duty manager or harbour office staff member responsible for checking display health and publishing local notices.

## Problem

Harbour-side teams often combine weather, tide, ferry, berth, safety, and local
environmental context from fragmented systems, radio updates, noticeboards,
manual checks, and local knowledge. Visitors and staff need a shared, calm read
of current harbour conditions without exposing them to specialist maritime
control tools.

## Product Doctrine

- HarbourWatch is a situational awareness display.
- HarbourWatch is not a vessel traffic management system.
- It can summarize, label freshness, and show local status.
- It must not issue navigation commands, control vessel movement, or imply
  authority over harbour master decisions.
- It should be calm, trustworthy, environmental, and operational rather than
  alarmist or control-room dense.

## Data Signals

Likely public/open data:

- weather forecast and observed conditions
- marine weather where available
- tide, flood, or water-level context where available
- map and local reference data
- air quality or environmental context where relevant

Likely fixture/internal data:

- berth availability
- ferry-terminal readiness
- local safety notices
- staff-published advisories
- queue or passenger load bands
- equipment or service readiness

## MVP Experience

- One shared display showing the current harbour operating picture.
- Top-level state such as calm, watchful, constrained, or disrupted.
- Weather and tide context presented in plain language.
- Ferry/berth/safety/local notices shown as factual status cards or rows.
- Freshness and degradation cues visible without technical provider language.
- Optional local-only ops view for display health, data freshness, and notice checks.

## Non-Goals

- No route planning.
- No vessel tracking beyond high-level public status if BMAD later justifies it.
- No navigation instructions.
- No emergency command workflow.
- No replacement for harbour authority systems, radio procedures, or statutory notices.
