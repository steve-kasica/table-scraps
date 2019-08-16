# The Cube Root Law

This `resp` field is interesting in terms of wrangling because it incorporates an algorithm over an external data structure into its column definitions.

```
return {
    year: +d.year,
    population: +d.people,
    reps: (+d.people) ** (1/3) - 2 * (states.filter(s => s <= d.year).length)
}
```

YEAR | POP    | REPS
 --- | ------ | -------------
1810 | 9 mil  | `POP`^(1/3 - 2x)
1820 | 12 mil | `POP`^(1/3 - 2x)
1830 | 17 mil | `POP`^(1/3 - 2x)

where x equals the length of list such that year is less than the `year` value in table

```
[1787, 1787, 1787, ..., 1816, 1817, ...]
```

So if you joined a table that had two columns, year and number of states, you could do the same calculation.


YEAR | POP    | STATES | REPS
 --- | ------ | ------ | -----------------------
1810 | 9 mil  | 17     | `POP`^(1/3 - 2`STATES`)
1820 | 12 mil | 23     | `POP`^(1/3 - 2`STATES`)
1830 | 17 mil | 24     | `POP`^(1/3 - 2`STATES`)

Also, the state dataset looks extremely similar to the [List of U.S. states by admission to the Union](https://simple.wikipedia.org/wiki/List_of_U.S._states_by_date_of_admission_to_the_Union) on Wikipedia.