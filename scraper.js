const puppeteer = require("puppeteer");
const xlsx = require("xlsx");
const config = require("./config/constants");
const logger = require("./utils/logger");

// Extract the base URL to scrape from the configuration
const baseScrappedURL = config.baseScrappedURL;

async function initScraping() {
  try {
    logger.log("Launching browser...");

    // Launch a new browser instance
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the base URL
    logger.log(`Navigating to ${baseScrappedURL}`);
    await page.goto(baseScrappedURL, {
      waitUntil: "networkidle2", // Wait until the network is idle
      timeout: 60000, // Set a timeout of 60 seconds
    });

    // Scrape the list of dogs
    logger.log("Scraping dogs list...");
    const dogList = await page.evaluate(() => {
      const dogSections = Array.from(
        document.querySelectorAll(".hewiki-columns-nobreak-list")
      );
      const dogList = [];

      // Loop through each section and extract dog names and links
      dogSections.forEach((section) => {
        const dogs = section.querySelectorAll("li");
        dogs.forEach((dog) => {
          const name = dog.innerText.split("\n")[0];
          const link = dog.querySelector("a")
            ? dog.querySelector("a").href
            : null;
          dogList.push({ name, link });
        });
      });

      return dogList; // Return the list of dogs with names and links
    });

    logger.log(`Found ${dogList.length} dogs. Scraping details...`);
    const dogDetailsList = [];

    // Loop through each dog and scrape additional details
    for (const dog of dogList) {
      logger.log(`Scraping details for ${dog.name}...`);
      if (dog.link) {
        let retries = 3;
        while (retries > 0) {
          try {
            await page.goto(dog.link, {
              waitUntil: "networkidle2", // Wait until the network is idle
              timeout: 60000, // Set a timeout of 60 seconds
            });

            const details = await page.evaluate(() => {
              const getDetail = (label) => {
                const detailRow = Array.from(
                  document.querySelectorAll("tr")
                ).find((row) => row.innerText.includes(label));
                return detailRow
                  ? detailRow.querySelector("td:last-child").innerText
                  : "";
              };

              // Extract the details for origin, temperament, and description
              return {
                origin: getDetail("ארץ מוצא"),
                temperament: getDetail("אופי"),
                description: Array.from(
                  document.querySelectorAll(".mw-parser-output > p")
                )
                  .map((p) => p.innerText)
                  .join("\n"),
              };
            });

            dogDetailsList.push({ name: dog.name, ...details });
            break; // Break out of the retry loop if successful
          } catch (err) {
            logger.error(
              `Failed to scrape ${dog.name}. Retries left: ${retries - 1}`
            );
            retries--;
            if (retries === 0) {
              dogDetailsList.push({
                name: dog.name,
                origin: "",
                temperament: "",
                description: "",
              });
              logger.error(`Giving up on ${dog.name}`);
            }
          }
        }
      } else {
        dogDetailsList.push({
          name: dog.name,
          origin: "",
          temperament: "",
          description: "",
        });
      }
    }

    // Close the browser after scraping is done
    await browser.close();
    logger.log("Creating Excel file...");

    // Create an Excel workbook and worksheet from the scraped data
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(dogDetailsList);
    xlsx.utils.book_append_sheet(workbook, worksheet, "Dogs");

    // Write the workbook to a file
    xlsx.writeFile(workbook, "dogs.xlsx");

    logger.log("Scraping and Excel file creation completed.");
  } catch (error) {
    logger.error("Error occurred:", error);
  }
}

// Start the scraping process
initScraping();
