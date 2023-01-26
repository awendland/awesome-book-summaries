const { readFileSync } = require("fs");

if (!process.argv[2]) {
    console.error("⚠️  Please provide a path to the README.md file.");
    process.exit(1);
}

const currentSummarySection = readFileSync(process.argv[2], "utf8")
    .split("<!-- summary-list:start -->")[1]
    .split("<!-- summary-list:end -->")[0]
    .trim();

const summarySites = currentSummarySection
    .split("\n")
    .filter((line) => line .startsWith("* ["))
    .map((line) => line.split("](")[1].split(")")[0])
    .sort();

const summarySitesQuerySuffix = summarySites
    .map(s => `site:${s}`)
    .join(" OR ");

const queryText = `BOOK_TITLE ${summarySitesQuerySuffix}`;
const queryUrl = `https://www.google.com/search?q=${encodeURIComponent(queryText)}`;

const querySection = `\
[Google Search query](${queryUrl})

or, manually:

\`\`\`
${queryText}
\`\`\``

const currentQuerySection = readFileSync("README.md", "utf8")
    .split("<!-- query-section:start -->")[1]
    .split("<!-- query-section:end -->")[0]
    .trim();

if (currentQuerySection !== querySection) {
    console.error(`\
⚠️  Query section is out of date! It should look like this:

<!-- query-section:start -->
${querySection}
<!-- query-section:end -->
`);
    process.exit(1);
} else {
    console.log("✅ Query section is up to date.");
}