# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Questwyst — Story Pages Guide

This folder holds every genre's branching story. Read this before adding
a new genre or a new scene.

## Folder structure

One flat folder per genre. No subfolders inside it — every scene for
that genre is a sibling file, sitting right next to the others.

```
client/
├── index.html          <- home page, genre picker
├── style.css             <- ALL styling lives here, shared by every page
├── public/
│   └── qt-logo.png
└── stories/
    ├── README.md          <- this file
    ├── _template/
    │   └── scene-template.html   <- copy this to start a new scene
    ├── romance/
    │   ├── 1-start.html            <- root scene
    │   ├── 2a-ask-why.html         <- chose A
    │   ├── 2b-row-along.html       <- chose B
    │   ├── 3aa-offer-to-join.html  <- chose A, then A (ending)
    │   ├── 3ab-say-goodbye.html    <- chose A, then B (ending)
    │   ├── 3ba-ask-on-shore.html   <- chose B, then A (ending)
    │   └── 3bb-mystery-stays.html  <- chose B, then B (ending)
    ├── western/    (same pattern once built)
    ├── scifi/      (same pattern once built)
    ├── horror/     (same pattern once built)
    └── comedy/     (same pattern once built)
```
