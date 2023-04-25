const axios = require("axios");
const { stripIndents } = require("common-tags");
const nodemailer = require("nodemailer");
const fs = require("fs");

// Read configuration from file
const config = JSON.parse(fs.readFileSync("config.json"));

// Set up email transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.email.user,
    pass: config.email.password,
  },
});

// Set up headers
const headers = {
  "Accept-Language": "fr-FR",
};

// Store the last known state of the resources
let lastResourcesState = [];

// Load last known state from file
try {
  const data = fs.readFileSync("resources-state.json");
  lastResourcesState = JSON.parse(data);
  console.log("Last known state loaded successfully.");
} catch (error) {
  console.error("Failed to load last resources state:", error);
}

// Function to check for new or updated resources
async function checkResources() {
  console.log("Checking for new or updated resources...");
  try {
    const response = await axios.get(config.apiUrl, { headers });
    const resources = response.data.prestations;

    // Compare the current state of the resources to the last known state
    for (const resource of resources) {
      const lastResource = lastResourcesState.find(
        (r) => r.prestId === resource.prestId
      );
      if (
        !lastResource ||
        JSON.stringify(lastResource) !== JSON.stringify(resource)
      ) {
        // Resource is new or updated, send email notification
        const mailOptions = {
          from: config.email.user,
          to: config.email.recipient,
          subject: `Nouvelle ressource ${resource.prestName} ${
            lastResource ? "mise à jour" : "créée"
          } sur Travelski`,
          text: stripIndents`
            Détails de la ressource:

            ID: ${resource.prestId}
            Nom: ${resource.prestName}
            Description: ${resource.prestDesc}
            Prix: ${resource.pricePerLogement}€

            Page du produit: https://www.travelski.com${resource.productPageUrl}`,
        };
        await transporter.sendMail(mailOptions);
        console.log(`Email sent for resource ${resource.prestName}.`);
      }
    }

    // Update the last known state of the resources
    lastResourcesState = resources;

    // Save last known state to file
    fs.writeFileSync(
      "resources-state.json",
      JSON.stringify(lastResourcesState)
    );
    console.log("Last known state saved to file.");
  } catch (error) {
    console.error(error);
  }
}

// Check for new or updated resources every 12 hours
setInterval(checkResources, 12 * 60 * 60 * 1000);
console.log("Resource check started.");
checkResources();
