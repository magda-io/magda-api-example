// Simple example of what you can do with the Magda api - this crawls the first 100 dataset records
// stored in the Magda api and gets data for a tagcloud from the keywords attribute.

import crawl from "./crawl";

(async () => {
  // Look at https://search.data.gov.au/api/v0/registry/records/summary
  // to find other aspects - interesting ones include source-link-status,
  // dcat-distribution-strings, and dataset-format
  const aspects = ["dcat-dataset-strings"];

  const tagCloud: { [tag: string]: number } = {};

  await crawl(
    aspects,
    async record => {
      const keywords: string[] =
        record.aspects["dcat-dataset-strings"].keywords;

      if (keywords) {
        keywords.forEach(keyword => {
          if (typeof tagCloud[keyword] === "undefined") {
            tagCloud[keyword] = 0;
          }

          tagCloud[keyword] += 1;
        });
      }
    },
    100
  );

  console.log(tagCloud);
})().catch(e => {
  console.error(e);
  process.exit(1);
});
