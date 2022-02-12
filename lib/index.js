"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var rss_parser_1 = __importDefault(require("rss-parser"));
var events_1 = require("events");
var PollerStatus;
(function (PollerStatus) {
    PollerStatus[PollerStatus["IDLE"] = 0] = "IDLE";
    PollerStatus[PollerStatus["CHECKING"] = 1] = "CHECKING";
    PollerStatus[PollerStatus["STOPPED"] = 2] = "STOPPED";
})(PollerStatus || (PollerStatus = {}));
var Poller = /** @class */ (function (_super) {
    __extends(Poller, _super);
    function Poller(config) {
        var _a;
        var _this = _super.call(this) || this;
        _this.config = config;
        _this.lastGuid = null;
        _this.status = PollerStatus.IDLE;
        _this.interval = setInterval(_this.tryCheck.bind(_this), (_a = _this.config.interval) !== null && _a !== void 0 ? _a : 60 * 1000);
        _this.emit("ready");
        return _this;
    }
    Poller.prototype.handleNewFeed = function (items) {
        var itemsCopy = __spreadArray([], items, true);
        var lastItem = itemsCopy.pop();
        if (!lastItem)
            return;
        this.setLastGuid(lastItem.guid);
        this.emit("feed", lastItem);
        return this.handleNewFeed(itemsCopy);
    };
    Poller.prototype.trimSeen = function (items) {
        return [];
    };
    Poller.prototype.checkNewFeed = function () {
        return __awaiter(this, void 0, void 0, function () {
            var parser, feed, firstItem, unseenFeed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.setStatus(PollerStatus.CHECKING);
                        parser = new rss_parser_1.default(this.config.parserConfig);
                        return [4 /*yield*/, parser.parseURL(this.config.url)];
                    case 1:
                        feed = _a.sent();
                        if (!feed || !feed.items || feed.items.length <= 0)
                            return [2 /*return*/];
                        if (!this.lastGuid) {
                            firstItem = feed.items.shift();
                            this.setLastGuid(firstItem.guid);
                        }
                        else {
                            unseenFeed = this.trimSeen(feed.items);
                            this.handleNewFeed(unseenFeed);
                        }
                        this.setStatus(PollerStatus.IDLE);
                        return [2 /*return*/];
                }
            });
        });
    };
    Poller.prototype.setStatus = function (status) {
        switch (status) {
            case PollerStatus.CHECKING:
                this.status = PollerStatus.CHECKING;
                this.emit("checking");
                break;
            case PollerStatus.IDLE:
                this.status = PollerStatus.IDLE;
                this.emit("idle");
                break;
            case PollerStatus.STOPPED:
                this.status = PollerStatus.STOPPED;
                this.emit("stopped");
                break;
        }
    };
    Poller.prototype.setLastGuid = function (guid) {
        this.lastGuid = guid;
        this.emit("last-guid", guid);
    };
    Poller.prototype.tryCheck = function () {
        if (this.status !== PollerStatus.IDLE)
            return;
        this.checkNewFeed();
    };
    Poller.prototype.toggle = function (value) {
        if (value === void 0) { value = false; }
        if (value) {
            this.setStatus(PollerStatus.IDLE);
        }
        else {
            this.setStatus(PollerStatus.STOPPED);
        }
    };
    return Poller;
}(events_1.EventEmitter));
exports.default = Poller;
//# sourceMappingURL=index.js.map