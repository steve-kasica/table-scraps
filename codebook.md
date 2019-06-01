
# Codebook

## High level codes

High level codes are in blue and begin with a "HL:" prefix.

* Calculate yearly change
* Dataset contains incomplete records
* Drop dirty data
* Plot data, *type of plot*, *number of annotations*
    * histogram
* Manually select which columns to use in analysis
* Environment, *type*
    * Python 2.7

## Low level codes

Low level codes are in yellow and begin with an "LL:" prefix

* Calculate summary statistic, *type of statistic*
    * type of statistic: percent change, difference, percentage
* Convert column data type, *original type* to *final type*
* Count total records
* Create new dimension from calculation on other columns, *number of other columns*, *type of calculation*
    * type of calculation: percent change, difference, z-score
* Drop entirely duplicate rows, *number of duplicates*
* Export data, *format*
    * format: CSV
* Group by column, *number of columns*, *post grouping function*
    * post groupping function: count, sum, mean
* Import data, *data format*
* Join datasets, *type of join*
    * type of join: inner
* Peak at data, *number of rows*
* Rename columns, *number of columns*
* Set format of data type, *data type*
* Sort dataset, *number of columns sorted by*, *direction*
* Subset dataset by dimension, *row numbers*
* Subset dataset by expression, *expression description*, *"new|same table"*
    * expression description: one column value by whitelist, one column not equal to number, one column value by blacklist