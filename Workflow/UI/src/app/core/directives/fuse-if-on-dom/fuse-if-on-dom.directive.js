"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var FuseIfOnDomDirective = /** @class */ (function () {
    function FuseIfOnDomDirective(templateRef, viewContainer, element) {
        this.templateRef = templateRef;
        this.viewContainer = viewContainer;
        this.element = element;
        this.isCreated = false;
    }
    FuseIfOnDomDirective.prototype.ngAfterContentChecked = function () {
        var _this = this;
        if (document.body.contains(this.element.nativeElement) && !this.isCreated) {
            setTimeout(function () {
                _this.viewContainer.createEmbeddedView(_this.templateRef);
            }, 300);
            this.isCreated = true;
        }
        else if (this.isCreated && !document.body.contains(this.element.nativeElement)) {
            this.viewContainer.clear();
            this.isCreated = false;
        }
    };
    FuseIfOnDomDirective = __decorate([
        core_1.Directive({
            selector: '[fuseIfOnDom]'
        })
    ], FuseIfOnDomDirective);
    return FuseIfOnDomDirective;
}());
exports.FuseIfOnDomDirective = FuseIfOnDomDirective;
