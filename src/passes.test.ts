import { expect } from 'chai';
import { passes } from './passes';

describe('passes', function () {

    const ConstraintsPass = [
        { $gt: 4 },
        { $lt: 6 },
        { $gte: 5 },
        { $lte: 5 },
        { $in: [3, 5, 8] },
        { $nin: [2, 6, 7] }
    ];

    it('should return true, if the object DID pass the constraint', function () {
        for (const constraint of ConstraintsPass) {
            expect(passes({ field: constraint }, { field: 5 })).to.be.true;
        }
    });

    const ConstraintsFail = [
        { $gt: 5 },
        { $lt: 5 },
        { $gte: 5.1 },
        { $lte: 4.9 },
        { $in: [3, 6, 8] },
        { $nin: [2, 5, 7] }
    ];

    it('should return false, if the object DID NOT passed the constraint', function () {
        for (const constraint of ConstraintsFail) {
            expect(passes({ field: constraint }, { field: 5 })).to.be.false;
        }
    });
});