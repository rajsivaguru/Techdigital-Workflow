"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ProgressBarConfig = /** @class */ (function () {
    function ProgressBarConfig(config) {
        this.isVisible = config.isVisible || false;
        this.color = config.color || 'warn';
        this.mode = config.mode || 'indeterminate';
        this.value = config.value || 25;
        this.bufferValue = config.bufferValue || 50;
    }
    ProgressBarConfig.prototype.showProgress = function () {
        this.isVisible = true;
    };
    ProgressBarConfig.prototype.hideProgress = function () {
        this.isVisible = false;
    };
    return ProgressBarConfig;
}());
exports.ProgressBarConfig = ProgressBarConfig;
