"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var GetByIdPipe = /** @class */ (function () {
    function GetByIdPipe() {
    }
    GetByIdPipe.prototype.transform = function (value, id, property) {
        var foundItem = value.find(function (item) {
            if (item.id !== undefined) {
                return item.id === id;
            }
            return false;
        });
        if (foundItem) {
            return foundItem[property];
        }
    };
    GetByIdPipe = __decorate([
        core_1.Pipe({
            name: 'getById',
            pure: false
        })
    ], GetByIdPipe);
    return GetByIdPipe;
}());
exports.GetByIdPipe = GetByIdPipe;
