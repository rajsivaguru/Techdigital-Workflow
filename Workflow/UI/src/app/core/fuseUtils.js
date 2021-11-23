"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FuseUtils = /** @class */ (function () {
    function FuseUtils() {
    }
    FuseUtils.filterArrayByString = function (mainArr, searchText) {
        var _this = this;
        if (searchText === '') {
            return mainArr;
        }
        searchText = searchText.toLowerCase();
        return mainArr.filter(function (itemObj) {
            return _this.searchInObj(itemObj, searchText);
        });
    };
    FuseUtils.searchInObj = function (itemObj, searchText) {
        for (var prop in itemObj) {
            if (!itemObj.hasOwnProperty(prop)) {
                continue;
            }
            var value = itemObj[prop];
            if (typeof value === 'string') {
                if (this.searchInString(value, searchText)) {
                    return true;
                }
            }
            else if (Array.isArray(value)) {
                if (this.searchInArray(value, searchText)) {
                    return true;
                }
            }
            if (typeof value === 'object') {
                if (this.searchInObj(value, searchText)) {
                    return true;
                }
            }
        }
    };
    FuseUtils.searchInArray = function (arr, searchText) {
        for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
            var value = arr_1[_i];
            if (typeof value === 'string') {
                if (this.searchInString(value, searchText)) {
                    return true;
                }
            }
            if (typeof value === 'object') {
                if (this.searchInObj(value, searchText)) {
                    return true;
                }
            }
        }
    };
    FuseUtils.searchInString = function (value, searchText) {
        return value.toLowerCase().includes(searchText);
    };
    FuseUtils.generateGUID = function () {
        function S4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return S4() + S4();
    };
    FuseUtils.toggleInArray = function (item, array) {
        if (array.indexOf(item) === -1) {
            array.push(item);
        }
        else {
            array.splice(array.indexOf(item), 1);
        }
    };
    FuseUtils.handleize = function (text) {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-') // Replace spaces with -
            .replace(/[^\w\-]+/g, '') // Remove all non-word chars
            .replace(/\-\-+/g, '-') // Replace multiple - with single -
            .replace(/^-+/, '') // Trim - from start of text
            .replace(/-+$/, ''); // Trim - from end of text
    };
    return FuseUtils;
}());
exports.FuseUtils = FuseUtils;
function getBaseLocation() {
    var paths = location.pathname.split('/').splice(1, 1);
    //console.log(paths)
    var basePath = (paths && paths[0]) || ''; // Default: my-account
    return '/' + basePath;
}
exports.getBaseLocation = getBaseLocation;
