"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var keys_pipe_1 = require("./keys.pipe");
var getById_pipe_1 = require("./getById.pipe");
var htmlToPlaintext_pipe_1 = require("./htmlToPlaintext.pipe");
var filter_pipe_1 = require("./filter.pipe");
var camelCaseToDash_pipe_1 = require("./camelCaseToDash.pipe");
var FusePipesModule = /** @class */ (function () {
    function FusePipesModule() {
    }
    FusePipesModule = __decorate([
        core_1.NgModule({
            declarations: [
                keys_pipe_1.KeysPipe,
                getById_pipe_1.GetByIdPipe,
                htmlToPlaintext_pipe_1.HtmlToPlaintextPipe,
                filter_pipe_1.FilterPipe,
                camelCaseToDash_pipe_1.CamelCaseToDashPipe
            ],
            imports: [],
            exports: [
                keys_pipe_1.KeysPipe,
                getById_pipe_1.GetByIdPipe,
                htmlToPlaintext_pipe_1.HtmlToPlaintextPipe,
                filter_pipe_1.FilterPipe,
                camelCaseToDash_pipe_1.CamelCaseToDashPipe
            ]
        })
    ], FusePipesModule);
    return FusePipesModule;
}());
exports.FusePipesModule = FusePipesModule;
