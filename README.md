<h1 align="center">filter-logic-subtract</h1>

[![CircleCI](https://img.shields.io/circleci/project/github/JohannesLamberts/filter-logic-subtract/master.svg)](https://circleci.com/gh/JohannesLamberts/filter-logic-subtract)
[![Coverage](https://img.shields.io/codecov/c/github/JohannesLamberts/filter-logic-subtract/master.svg)](https://codecov.io/gh/JohannesLamberts/filter-logic-subtract)

## Use case

You need to fetch a lot of data from a remote server (with a filter that is defined on client-side and executed on server-side).

You want to fetch additional data of the same type, but **you do not want to load documents a second time**.

You could now include something like `{ _id: { $nin: [ ... a lot of ids ] } }` to your filter.

This package offers a different approach: You just have to subtract the previously used filter from your new one.

## Example

You implemented a calender with a day- and a month-view.
There are a lot of events each there (therefore its expensive to exclude already fetched ids from new queries).

The user navigates through the app:

| Time span fetched | Internal query | Query to server |
|---|---|---|
|02.01. | `{date: {$in: [02.01.]}` | `{date: {$in: [02.01.]}`
|01.01. - 07.01. | `{date: {$gte: '01.01.', $lte: '07.01.'` | `{date: {$gte: '01.01.', $lte: '07.01.', $nin: [02.01.]`
|04.01. - 10.01. | `{date: {$gte: '04.01.', $lte: '10.01.'` | `{date: {$gt: '07.01.', $lte: '10.01.'}`

## When to use

All of this does only make since if you need to fetch a lot of data 
or really must reduce the transferred data to a minimum.

If you don't, you might want to just fetch that data a second time.

## Requirements / Interface

```typescript
export type FilterConstraint = {
    $in?: any[];
    $nin?: any[];
    $lt?: any;
    $gt?: any;
    $lte?: any;
    $gte?: any;
}

export interface Filter {
    [key: string]: FilterConstraint;
}
```
The operations are restricted to the above.

`{ $eq: VAL }` must be replaced by `{ $in: [ VAL ] }`.

`{ $ne: VAL }` must be replaced by `{ $nin: [ VAL ] }`. 

So far, it is not possible to use query operators like $and, $or, $all etc... 

## How to use