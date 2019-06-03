
# Codebook

## High level codes

High level codes begin with a "HL:" prefix.

* Calculate yearly change
* Calculate average
* Dataset contains incomplete records
* Detrend
* Drop dirty data
* Parallel table operations, *number of tables*
    * Definition: When the user is performing the same operations on more than one dataset.
* Plot data, *type of plot*, *number of annotations*
    * histogram
* Manually select which columns to use in analysis
* Environment, *type*
    * Python 2.7

## Low level codes

Low level codes begin with an "LL:" prefix

* Calculate summary statistic, *type of statistic*
    * type of statistic: percent change, difference, percentage
* Convert column data type, *original type* to *final type*
* Count total records
* Create new dimension from calculation on other columns, *number of other columns*, *type of calculation*
    * type of calculation: percent change, difference, z-score, adjust for inflation
* Drop entirely duplicate rows, *number of duplicates*
* Display all columns
* Export data, *format*
    * format: CSV
* Group by column, *number of columns*, *post grouping function*, *number of aggregate columns*
    * post groupping function: count, sum, mean
* Import data, *data format*
    * data format: Excel, CSV
* Join datasets, *type of join*
    * type of join: inner, union
* Peak at data, *number of rows*
* Rename columns, *number of columns*
* Set format of data type, *data type*
* Sort dataset, *number of columns sorted by*, *direction*
* Subset dataset by dimension, *number of columns*
* Subset dataset by inner-join whitelist, *"new|same table"*
* Subset dataset by expression, *expression description*, *"new|same table"*
    * expression description: one column value by whitelist, one column not equal to number, one column value by blacklist, (x & y) | (z & q & r)