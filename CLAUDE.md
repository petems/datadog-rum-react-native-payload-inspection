# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React Native demo app that showcases custom Datadog RUM resource tracking with payload inspection. It fetches data from JSONPlaceholder, validates the response structure, computes metadata, and sends custom attributes to Datadog RUM via manual `DdRum.startResource()`/`stopResource()` instrumentation.

## Commands

- **Start Metro dev server**: `npm start`
- **Run on iOS**: `npm run ios`
- **Run on Android**: `npm run android`
- **Run tests**: `npm run test`
- **Run a single test**: `npx jest __tests__/App.test.tsx`
- **Lint**: `npm run lint`

Requires Node >= 22.11.0.

## Architecture

- **`App.tsx`** — Root component wrapping the app with `DatadogProvider`. Credentials loaded from `credentials.json` (gitignored; see `credentials.example.json` for the template).
- **`src/MainScreen.tsx`** — Single-screen UI with a FETCH button that triggers the instrumented API call and displays results.
- **`src/fetchWithRum.ts`** — Core logic: fetches from JSONPlaceholder API, validates post schema, computes metadata (post count, unique users, avg title length, structure validity), and wraps the entire flow in `DdRum.startResource()`/`stopResource()` with custom attributes. Distinguishes network vs parse errors for RUM tracking.

## Key Design Decisions

- **Manual RUM instrumentation** — `trackResources` is set intentionally to control exactly what gets reported. The app demonstrates explicit `DdRum` API usage rather than relying on auto-tracking.
- **Credentials via JSON file** — `credentials.json` contains `clientToken`, `applicationId`, and `environment`. Never commit this file.
- **`specs/INITIAL_PLAN.md`** — Contains the original project requirements and design rationale.
