# ProjectLanguages

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Issues](https://img.shields.io/github/issues/ShubhGupta2125/ProjectLanguages.svg)](https://github.com/ShubhGupta2125/ProjectLanguages/issues)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)

## Overview

**ProjectLanguages** is a lightweight TypeScript utility that provides a way to analyze programming languages used in repositories. This tool allows you to fetch the languages used in GitHub repositories and evaluate the usage distribution of each language based on the repository data.

## Features

- Fetch language data for GitHub repositories.
- Analyze the usage of multiple programming languages.
- Lightweight and easy to integrate into other projects.
- TypeScript-based for type safety and modern JavaScript support.

  ## Prerequisites

- node version __16.20.2__

## Installation

To install the project dependencies, clone the repository and run:

```bash
git clone https://github.com/ShubhGupta2125/ProjectLanguages.git
cd ProjectLanguages
npm install
```

Compile the code

```bash
npm run build
```

## Usage

### Setting token

```bash
export GIT_PROVIDER_TOKEN=<token>
```
or pass into the utility using --token

### To fetch the top 5 used languages:

```bash
node src/build/main.js --provider GITHUB --username ShubhGupta2125 --token <Enter Github token here>
```

Right now, only GITHUB is supported, we can add more providers in the future

## Testing

```bash
jest
```
or 
```bash
npm run test
```
