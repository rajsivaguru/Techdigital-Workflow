export class ProgressBarConfig {
    isVisible: boolean;
    color: string;
    mode: string;
    value: number;
    bufferValue: number;

    constructor(config)
    {
        this.isVisible = config.isVisible || false;
        this.color = config.color || 'warn';
        this.mode = config.mode || 'indeterminate';
        this.value = config.value || 25;
        this.bufferValue = config.bufferValue || 50;
    }

    showProgress(): void {
        this.isVisible = true;
    }

    hideProgress(): void {
        this.isVisible = false;
    }
}