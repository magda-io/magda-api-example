import * as URI from "urijs";
import fetch from "node-fetch";

/**
 * A record in the Magda registry
 */
type Record = {
  id: string;
  name: string;
  aspects: { [aspectId: string]: any };
};

/**
 * A page returned from the /records endpoint of the Magda API.
 */
type Page = {
  hasMore: boolean;
  nextPageToken: string;
  records: Record[];
};

/**
 * Crawls through Madgda's registry, getting the records with the aspects specified.
 *
 * @param aspects The aspect ids to get from the registry
 * @param onRecord An async function that will be executed when each new record is found -
 *      the function will wait to get new records until the promise returned by this function
 *      has resolved
 * @param limit An upper limit to the number of records to get - the crawl will stop and the
 *      promise it returns will resolve after this limit is reached.
 *
 * @returns A promise that resolves when the limit has been reached or there's no more records.
 */
export default async function crawl(
  aspects: string[],
  onRecord: (record: Record) => Promise<void>,
  limit: number = 100
) {
  // See https://search.data.gov.au/api/v0/apidocs/index.html for a full guide to all the APIs
  // that are available.
  /** Base URI for getting records */
  const baseUrl = URI(
    "https://search.data.gov.au/api/v0/registry/records?limit=50&dereference=true"
  );

  // Add every aspect we want to look for to the uri.
  aspects.forEach(aspect => baseUrl.addQuery("aspect", aspect));

  /** How many records have we seen so far? */
  let count = 0;
  /** Should we keep going? */
  let keepGoing = true;
  /** The page token of the next page, as magda doesn't support simple pagination parameters */
  let nextPageToken = "0";

  while (keepGoing) {
    const url = baseUrl.clone();
    url.setQuery("pageToken", nextPageToken);

    const response = await fetch(url.toString());

    if (response.status !== 200) {
      throw new Error(
        `Bad response when requesting ${url.toString()}: ${response.status} ${
          response.statusText
        }`
      );
    }

    const json: Page = await response.json();

    const recordsRemainingUnderLimit = limit - count;
    const trimmedRecords = json.records.slice(0, recordsRemainingUnderLimit);

    trimmedRecords.forEach(async record => await onRecord(record));

    keepGoing = json.hasMore && trimmedRecords.length == json.records.length;
    nextPageToken = json.nextPageToken;
    count += trimmedRecords.length;

    if (keepGoing) {
      await pause();
    }
  }
}

/**
 * Simply pauses for a second so we don't smash the API too hard.
 */
async function pause() {
  return new Promise(resolve => setTimeout(resolve, 1000));
}
