# Notebooks

This file contains summaries of some wrangling activities observed in these repos created by journalists.

## Notebook descriptions

### Weather Data, *fivethirtyeight*

This article compares temperatures between 11 major cities in the United States for the 12 months between July 1, 2014 and July 1, 2015. It obtains this raw data by scraping Weather Underground weather stations. Some noteable things about this analysis include:

* This analysis include code for data scraping that combines scraped data into a single CSV file.
* This scraper checks that the parsed data is valid using domain-specifc rules.

### H2A Visa Disclosure Data, *Los Angeles Times*

Journalists analyze 10 years of H2A visa disclosure data from the Department of Labor. A high-level wrangling task in this analysis includes combining perodically published data from 2008 to 2017 into one dataset. Some of the key challenges in this task include:

* Resolving different column names for the same variable between years
* Generating a unique identifier for each combined record
* Deduplicating case records
* Resolving entity values in categorical variables

### IRS Audit Rates by County, *Propublica*

This project analyzed the geographic frequency of IRS audits. Overall, the wrangling portion of this notebook deals with combining data on tax return audits with tax returns filed. An initial wrangling task in this analysis involved combining Excel files of IRS filing data from 2012 to 2015. This is a good example of journalist having to wrangle data that was initially intended for presentation into a form that is usable for computation. Some key challenges in this task include:

* Resolving column names between the four different Excel files, luckily column position didn't change over time.
* Removing non-data rows including notes and totals
* Resolving entity names that changed over time

### Residential demolitions in Austin, *Austin American-Statesman*

In their analysis of residential demolistions, journalists had to first combine data on partial and full demolitions. This analysis hinges on being able to combine the different kinds of demolition permit data: full and partials. While being separate datasets, both seem to be schematically parallel, journalists were able to simply concat both DataFrames.