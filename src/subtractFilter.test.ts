import { expect }   from 'chai';
import { subtract } from './subtractFilter';

// TODO: test filters with multiple fields

describe('subtract', function () {

    describe('$lt/$gt', function () {
        it('should return only the unkonwn range', function () {
            expect(
                subtract({ field: { $gte: 5 } },
                         { field: { $gt: 3 } })
            )
                .to.eql([]);

            expect(
                subtract({},
                         { field: { $gte: 3 } })
            )
                .to.eql([{ field: { $lt: 3 } }]);
        });
    });

    describe('$in/$lt/$gt/$nin', function () {
        it('should return only the fields not within the range', function () {
            expect(
                subtract(
                    { field: { $in: [1, 2, 3, 4, 5] } },
                    [
                        { field: { $lt: [2] } },
                        { field: { $gte: [4] } }
                    ]
                ))
                .to.eql([
                            { field: { $in: [2, 3] } }
                        ]);
        });

        it('should return the known field from the range via $nin', function () {
            expect(
                subtract(
                    {
                        field: {
                            $lte: 4,
                            $gt: 0
                        }
                    },
                    { field: { $in: [1, 2] } }
                ))
                .to.eql([
                            {
                                field: {
                                    $gt: 0,
                                    $lte: 4,
                                    $nin: [1, 2]
                                }
                            }
                        ]);
        });

        it('should return only the fields that where not fetched via $nin', function () {
            expect(
                subtract(
                    {
                        field: {
                            $lt: 4,
                            $gt: 0
                        }
                    },
                    { field: { $nin: [1, 2, 3] } }
                ))
                .to.eql([
                            { field: { $in: [1, 2, 3] } }
                        ]);
        });
    });

    describe('$in/$nin', function () {
        it('should return an array of only the unknown elements', function () {

            expect(
                subtract(
                    { field: { $in: [4] } },
                    { field: { $in: [3, 4, 5] } }
                ))
                .to.eql([]);

            expect(
                subtract(
                    { field: { $nin: [3, 4, 5] } },
                    { field: { $nin: [4] } }
                ))
                .to.eql([]);

            const valsExisting = [2, 4, 5, 6];
            const valsFetch = [1, 2, 3, 5];

            expect(
                subtract(
                    { field: { $in: valsFetch } },
                    { field: { $in: valsExisting } }
                ))
                .to.eql([{ field: { $in: [1, 3] } }]);

            expect(
                subtract(
                    { field: { $nin: valsFetch } },
                    { field: { $nin: valsExisting } }
                ))
                .to.eql([{ field: { $in: [4, 6] } }]);

            expect(
                subtract(
                    { field: { $in: valsFetch } },
                    { field: { $nin: valsExisting } }
                ))
                .to.eql([{ field: { $in: [2, 5] } }]);

            expect(
                subtract(
                    { field: { $nin: valsFetch } },
                    { field: { $in: valsExisting } }
                ))
                .to.eql([{ field: { $nin: [1, 2, 3, 5, 4, 6] } }]);
        });
    });
    describe('$lt/$gt/$lte/$gte/$nin', function () {
        it('should return different areas', function () {
            expect(
                subtract(
                    {
                        field: {
                            $lt: 6,
                            $gt: 0
                        }
                    },
                    [
                        {
                            field: {
                                $lt: 1,
                                $gte: 0.5
                            }
                        },
                        {
                            field: {
                                $in: [0.25]
                            }
                        },
                        {
                            field: {
                                $in: [1.5]
                            }
                        },
                        {
                            field: {
                                $lt: 3,
                                $gt: 2
                            }
                        },
                        {
                            field: {
                                $lte: 7,
                                $gt: 5.5
                            }
                        }
                    ]))
                .to
                .eql([
                         {
                             field: {
                                 $gte: 3,
                                 $lte: 5.5
                             }
                         },
                         {
                             field: {
                                 $gte: 1,
                                 $lte: 2,
                                 $nin: [1.5]
                             }
                         },
                         {
                             field: {
                                 $gt: 0,
                                 $lt: 0.5,
                                 $nin: [0.25]
                             }
                         }
                     ]);
        });
    });
});