"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
var axios_1 = require("axios");
var jsdom_1 = require("jsdom");
var fs_1 = require("fs");
var path = require("path");
function gethtmlFromUrl(url) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios_1["default"](url)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.data];
            }
        });
    });
}
function ligainsiderHtmlToPriceTrend(html) {
    var dom = new jsdom_1.JSDOM(html);
    var rows = Array.from(dom.window.document.querySelectorAll('.table-responsive tbody > tr'));
    return rows.map(function (element) {
        var lastName = element.querySelector('td > strong > a').innerHTML;
        var unparsedDelta = element.querySelector('td:nth-child(9) > strong').innerHTML;
        var delta = Number(unparsedDelta.replace(/(\.)/g, '').replace(/(€)/g, ''));
        var linkPrefix = 'https://www.ligainsider.de';
        var linkPostFix = element.querySelector('td:nth-child(3) > strong > a').getAttribute('href');
        var detailPageLink = "" + linkPrefix + linkPostFix;
        return { lastName: lastName, delta: delta, detailPageLink: detailPageLink };
    });
}
function getKickbaseId(priceTrend) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var html, dom, anchor, link, kickbaseId;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, gethtmlFromUrl(priceTrend.detailPageLink)];
                case 1:
                    html = _b.sent();
                    dom = new jsdom_1.JSDOM(html);
                    anchor = dom.window.document.querySelector('a.btn_box');
                    link = anchor === null || anchor === void 0 ? void 0 : anchor.getAttribute('href');
                    kickbaseId = (_a = link === null || link === void 0 ? void 0 : link.split('?')[0].split('/')[5]) !== null && _a !== void 0 ? _a : '-1';
                    return [2 /*return*/, __assign(__assign({}, priceTrend), { kickbaseId: kickbaseId })];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, winnerUrl, loserUrl, _b, winnerHtml, loserHtml, priceTrendsWithoutIds, priceTrends, priceTrendObj;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = [
                        'https://www.ligainsider.de/stats/kickbase/marktwerte/tag/gewinner/',
                        'https://www.ligainsider.de/stats/kickbase/marktwerte/tag/verlierer/'
                    ], winnerUrl = _a[0], loserUrl = _a[1];
                    return [4 /*yield*/, Promise.all([winnerUrl, loserUrl].map(function (url) { return gethtmlFromUrl(url); }))];
                case 1:
                    _b = _c.sent(), winnerHtml = _b[0], loserHtml = _b[1];
                    priceTrendsWithoutIds = __spreadArray(__spreadArray([], ligainsiderHtmlToPriceTrend(winnerHtml)), ligainsiderHtmlToPriceTrend(loserHtml));
                    return [4 /*yield*/, Promise.all(priceTrendsWithoutIds.map(getKickbaseId))];
                case 2:
                    priceTrends = _c.sent();
                    priceTrendObj = {
                        date: new Date().toISOString().split('T')[0],
                        players: priceTrends
                    };
                    fs_1.writeFileSync(path.join(__dirname, 'price-trends.json'), JSON.stringify(priceTrendObj));
                    return [2 /*return*/];
            }
        });
    });
}
main();
