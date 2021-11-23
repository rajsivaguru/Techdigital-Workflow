"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var hljs = require("highlight.js");
var FuseHljsComponent = /** @class */ (function () {
    function FuseHljsComponent(elementRef) {
        this.elementRef = elementRef;
        this.hljs = hljs;
    }
    FuseHljsComponent.prototype.ngOnInit = function () {
        var originalSource = this.source.nativeElement.value;
        if (!originalSource || !this.lang) {
            return;
        }
        // Split the source into lines
        var sourceLines = originalSource.split('\n');
        // Find the first non-whitespace char index in
        // the first line of the source code
        var indexOfFirstChar = sourceLines[0].search(/\S|$/);
        // Generate the trimmed source
        var source = '';
        // Iterate through all the lines and trim the
        // beginning white space depending on the index
        sourceLines.forEach(function (line, index) {
            source = source + line.substr(indexOfFirstChar, line.length);
            if (index !== sourceLines.length - 1) {
                source = source + '\n';
            }
        });
        this.elementRef.nativeElement.innerHTML =
            "<pre><code class=\"highlight\">" + this.hljs.highlight(this.lang, source).value + "</code></pre>";
    };
    __decorate([
        core_1.ContentChild('source')
    ], FuseHljsComponent.prototype, "source", void 0);
    __decorate([
        core_1.Input('lang')
    ], FuseHljsComponent.prototype, "lang", void 0);
    FuseHljsComponent = __decorate([
        core_1.Component({
            selector: 'fuse-hljs',
            template: ' ',
            styleUrls: ['./hljs.component.scss']
        })
    ], FuseHljsComponent);
    return FuseHljsComponent;
}());
exports.FuseHljsComponent = FuseHljsComponent;
