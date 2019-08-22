/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */
const chaiHttp = require('chai-http');
const chaiModule = require('chai');
const axios = require('axios');
const assert = chaiModule.assert;
chaiModule.use(chaiHttp);
suite('Functional Tests', function () {
    suite('GET /api/stock-prices => stockData object', function () {
        test('1 stock', function (done) { });
        test('1 stock with like', function (done) { });
        test('1 stock with like again (ensure likes arent double counted)', function (done) { });
        test('2 stocks', function (done) { });
        test('2 stocks with like', function (done) { });
    });
});
//# sourceMappingURL=2_functional-tests.js.map