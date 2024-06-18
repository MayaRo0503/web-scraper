# Dog Breeds Scraper

This project is a web scraper that extracts information about dog breeds from a specified website and exports the data to an Excel file.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Code Overview](#code-overview)
- [Contributing](#contributing)
- [License](#license)

## Installation

To set up the project, follow these steps:

1. **Clone the repository:**

    ```sh
    git clone [https://github.com/your-username/dog-breeds-scraper.git](https://github.com/MayaRo0503/web-scraper.git)
    cd dog-breeds-scraper
    ```

2. **Install the dependencies:**

    Make sure you have Node.js and npm installed. Then run:

    ```sh
    npm install
    ```

    Additionally, install the necessary libraries:

    ```sh
    npm install puppeteer xlsx
    ```

## Usage

To run the scraper, use the following command:

```sh
node scraper.js
```

This will launch a headless browser, navigate to the specified website, scrape the dog breed data, and save it to an Excel file named `dogs.xlsx`.

## Project Structure

The project directory contains the following important files and folders:

- `scraper.js`: The main script that performs the web scraping.
- `config/constants.js`: Contains configuration constants such as the base URL to scrape.
- `utils/logger.js`: Contains logging utilities for consistent logging throughout the project.
- `node_modules/`: Contains the project's dependencies, including `puppeteer` and `xlsx`.
- `package.json`: Contains project metadata and dependencies.
- `README.md`: This file.

## Code Overview

### scraper.js

This file contains the main logic for the web scraping process:

- **Launching the Browser:** Initializes a Puppeteer browser instance.
- **Navigating to the Website:** Opens the specified URL.
- **Scraping the Data:** Extracts a list of dog breeds and their details.
- **Saving to Excel:** Saves the scraped data to an Excel file using the `xlsx` library.

### config/constants.js

This file contains configuration constants, such as:

```javascript
module.exports = {
  baseScrappedURL: 'https://example.com/dog-breeds', // Replace with the actual URL
};
```

### utils/logger.js

This file contains utilities for logging with different levels (log, info, trace, error) and colors:

```javascript
const colors = {
  Reset: "\x1b[0m",
  FgRed: "\x1b[31m",
  FgBlue: "\x1b[34m",
  FgWhite: "\x1b[37m",
  FgCyan: "\x1b[36m",
  FgGray: "\x1b[90m",
};

const levels = {
  log: colors.FgGray,
  info: colors.FgBlue,
  trace: colors.FgCyan,
  error: colors.FgRed,
};

function getTimestamp() {
  return new Date().toISOString();
}

function logMessage(level, ...args) {
  const color = levels[level] || colors.FgWhite;
  const timestamp = getTimestamp();
  const formattedArgs = args.map((arg) =>
    arg instanceof Error ? arg.stack : arg
  );
  console.log(`${color}[${timestamp}]${colors.Reset}:`, ...formattedArgs);
}

module.exports = {
  log: (...args) => logMessage("log", ...args),
  info: (...args) => logMessage("info", ...args),
  trace: (...args) => logMessage("trace", ...args),
  error: (...args) => logMessage("error", ...args),
};
```

### Adding puppeteer and xlsx to the Project

The project uses the `puppeteer` library to perform web scraping and the `xlsx` library to create and manage Excel files. Make sure to install the libraries by running:

```sh
npm install puppeteer xlsx
```

In `scraper.js`, you need to require the libraries as follows:

```javascript
const puppeteer = require("puppeteer");
const xlsx = require("xlsx");
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
```
