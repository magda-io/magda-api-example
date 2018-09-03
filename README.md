# Magda API Example

This is a simple quick example of building something with the Magda API built as an example for Govhack 2018. It looks at the first 100 records of https://search.data.gov.au, gathers all the `keyword` fields of the `dcat-dataset-strings` aspect and prints them out in the kind of format that could be used for a tag cloud.

This is intended to be extended into a proof of concept for doing something cooler - for instance, you could get the URL of each distribution, download it and do some kind of analysis on the data itself - like OCR image PDFs to text, or summarise text files to shorter text files, or calculate the geographic extent of CSV distributions with lat and long columns.

Everything is written in typescript because it's reasonably easy to work with and understand, but it could easily be translated into whatever language you like.

## #Inspo

For examples of things you can do, look at some of the minions in the Magda codebase.

- [This one looks for broken links](https://github.com/magda-io/magda/blob/master/magda-sleuther-broken-link/src/onRecordFound.ts)
- [This one figures out formats](https://github.com/magda-io/magda/blob/master/magda-sleuther-format/src/onRecordFound.ts)
- [This one determines quality based on format and availability](https://github.com/magda-io/magda/blob/master/magda-sleuther-linked-data-rating/src/onRecordFound.ts)
- [This one (poorly) parses CSV files to determine their schema](https://github.com/magda-io/magda/blob/master/magda-sleuther-visualization/src/onRecordFound.ts)

## To run

```bash
yarn install
yarn run dev
```
