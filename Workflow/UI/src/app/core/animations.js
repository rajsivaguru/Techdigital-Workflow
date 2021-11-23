"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var animations_1 = require("@angular/animations");
var customAnimation = animations_1.animation([
    animations_1.style({
        opacity: '{{opacity}}',
        transform: 'scale({{scale}}) translate3d({{x}}, {{y}}, {{z}})'
    }),
    animations_1.animate('{{duration}} {{delay}} cubic-bezier(0.0, 0.0, 0.2, 1)', animations_1.style('*'))
], {
    params: {
        duration: '200ms',
        delay: '0ms',
        opacity: '0',
        scale: '1',
        x: '0',
        y: '0',
        z: '0'
    }
});
exports.fuseAnimations = [
    animations_1.trigger('animate', [animations_1.transition('void => *', [animations_1.useAnimation(customAnimation)])]),
    animations_1.trigger('animateStagger', [
        animations_1.state('50', animations_1.style('*')),
        animations_1.state('100', animations_1.style('*')),
        animations_1.state('200', animations_1.style('*')),
        animations_1.transition('void => 50', animations_1.query('@*', [
            animations_1.stagger('50ms', [
                animations_1.animateChild()
            ])
        ], { optional: true })),
        animations_1.transition('void => 100', animations_1.query('@*', [
            animations_1.stagger('100ms', [
                animations_1.animateChild()
            ])
        ], { optional: true })),
        animations_1.transition('void => 200', animations_1.query('@*', [
            animations_1.stagger('200ms', [
                animations_1.animateChild()
            ])
        ], { optional: true }))
    ]),
    animations_1.trigger('fadeInOut', [
        animations_1.state('0', animations_1.style({
            display: 'none',
            opacity: 0
        })),
        animations_1.state('1', animations_1.style({
            display: 'block',
            opacity: 1
        })),
        animations_1.transition('1 => 0', animations_1.animate('300ms ease-out')),
        animations_1.transition('0 => 1', animations_1.animate('300ms ease-in'))
    ]),
    animations_1.trigger('slideInOut', [
        animations_1.state('0', animations_1.style({
            height: '0px',
            display: 'none'
        })),
        animations_1.state('1', animations_1.style({
            height: '*',
            display: 'block'
        })),
        animations_1.transition('1 => 0', animations_1.animate('300ms ease-out')),
        animations_1.transition('0 => 1', animations_1.animate('300ms ease-in'))
    ]),
    animations_1.trigger('slideInLeft', [
        animations_1.state('void', animations_1.style({
            transform: 'translateX(-100%)',
            display: 'none'
        })),
        animations_1.state('*', animations_1.style({
            transform: 'translateX(0)',
            display: 'flex'
        })),
        animations_1.transition('void => *', animations_1.animate('300ms')),
        animations_1.transition('* => void', animations_1.animate('300ms'))
    ]),
    animations_1.trigger('slideInRight', [
        animations_1.state('void', animations_1.style({
            transform: 'translateX(100%)',
            display: 'none'
        })),
        animations_1.state('*', animations_1.style({
            transform: 'translateX(0)',
            display: 'flex'
        })),
        animations_1.transition('void => *', animations_1.animate('300ms')),
        animations_1.transition('* => void', animations_1.animate('300ms'))
    ]),
    animations_1.trigger('slideInTop', [
        animations_1.state('void', animations_1.style({
            transform: 'translateY(-100%)',
            display: 'none'
        })),
        animations_1.state('*', animations_1.style({
            transform: 'translateY(0)',
            display: 'flex'
        })),
        animations_1.transition('void => *', animations_1.animate('300ms')),
        animations_1.transition('* => void', animations_1.animate('300ms'))
    ]),
    animations_1.trigger('slideInTop500', [
        animations_1.state('void', animations_1.style({
            transform: 'translateY(-100%)',
            display: 'none'
        })),
        animations_1.state('*', animations_1.style({
            transform: 'translateY(0)',
            display: 'flex'
        })),
        animations_1.transition('void => *', animations_1.animate('500ms')),
        animations_1.transition('* => void', animations_1.animate('300ms'))
    ]),
    animations_1.trigger('slideInBottom', [
        animations_1.state('void', animations_1.style({
            transform: 'translateY(100%)',
            display: 'none'
        })),
        animations_1.state('*', animations_1.style({
            transform: 'translateY(0)',
            display: 'flex'
        })),
        animations_1.transition('void => *', animations_1.animate('300ms')),
        animations_1.transition('* => void', animations_1.animate('300ms'))
    ]),
    animations_1.trigger('expandCollapse', [
        animations_1.state('void', animations_1.style({
            height: '0px'
        })),
        animations_1.state('*', animations_1.style({
            height: '*'
        })),
        animations_1.transition('void => *', animations_1.animate('300ms ease-out')),
        animations_1.transition('* => void', animations_1.animate('300ms ease-in'))
    ]),
    animations_1.trigger('routerTransitionLeft', [
        animations_1.transition('* => *', [
            animations_1.query('fuse-content > :enter, fuse-content > :leave', [
                animations_1.style({
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0
                })
            ], { optional: true }),
            animations_1.query('fuse-content > :enter', [
                animations_1.style({
                    transform: 'translateX(100%)',
                    opacity: 0
                })
            ], { optional: true }),
            animations_1.sequence([
                animations_1.group([
                    animations_1.query('fuse-content > :leave', [
                        animations_1.style({
                            transform: 'translateX(0)',
                            opacity: 1
                        }),
                        animations_1.animate('600ms cubic-bezier(0.0, 0.0, 0.2, 1)', animations_1.style({
                            transform: 'translateX(-100%)',
                            opacity: 0
                        }))
                    ], { optional: true }),
                    animations_1.query('fuse-content > :enter', [
                        animations_1.style({ transform: 'translateX(100%)' }),
                        animations_1.animate('600ms cubic-bezier(0.0, 0.0, 0.2, 1)', animations_1.style({
                            transform: 'translateX(0%)',
                            opacity: 1
                        }))
                    ], { optional: true })
                ]),
                animations_1.query('fuse-content > :leave', animations_1.animateChild(), { optional: true }),
                animations_1.query('fuse-content > :enter', animations_1.animateChild(), { optional: true })
            ])
        ])
    ]),
    animations_1.trigger('routerTransitionRight', [
        animations_1.transition('* => *', [
            animations_1.query('fuse-content > :enter, fuse-content > :leave', [
                animations_1.style({
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0
                })
            ], { optional: true }),
            animations_1.query('fuse-content > :enter', [
                animations_1.style({
                    transform: 'translateX(-100%)',
                    opacity: 0
                })
            ], { optional: true }),
            animations_1.sequence([
                animations_1.group([
                    animations_1.query('fuse-content > :leave', [
                        animations_1.style({
                            transform: 'translateX(0)',
                            opacity: 1
                        }),
                        animations_1.animate('600ms cubic-bezier(0.0, 0.0, 0.2, 1)', animations_1.style({
                            transform: 'translateX(100%)',
                            opacity: 0
                        }))
                    ], { optional: true }),
                    animations_1.query('fuse-content > :enter', [
                        animations_1.style({ transform: 'translateX(-100%)' }),
                        animations_1.animate('600ms cubic-bezier(0.0, 0.0, 0.2, 1)', animations_1.style({
                            transform: 'translateX(0%)',
                            opacity: 1
                        }))
                    ], { optional: true })
                ]),
                animations_1.query('fuse-content > :leave', animations_1.animateChild(), { optional: true }),
                animations_1.query('fuse-content > :enter', animations_1.animateChild(), { optional: true })
            ])
        ])
    ]),
    animations_1.trigger('routerTransitionUp', [
        animations_1.transition('* => *', [
            animations_1.query('fuse-content > :enter, fuse-content > :leave', [
                animations_1.style({
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0
                })
            ], { optional: true }),
            animations_1.query('fuse-content > :enter', [
                animations_1.style({
                    transform: 'translateY(100%)',
                    opacity: 0
                })
            ], { optional: true }),
            animations_1.group([
                animations_1.query('fuse-content > :leave', [
                    animations_1.style({
                        transform: 'translateY(0)',
                        opacity: 1
                    }),
                    animations_1.animate('600ms cubic-bezier(0.0, 0.0, 0.2, 1)', animations_1.style({
                        transform: 'translateY(-100%)',
                        opacity: 0
                    }))
                ], { optional: true }),
                animations_1.query('fuse-content > :enter', [
                    animations_1.style({ transform: 'translateY(100%)' }),
                    animations_1.animate('600ms cubic-bezier(0.0, 0.0, 0.2, 1)', animations_1.style({
                        transform: 'translateY(0%)',
                        opacity: 1
                    }))
                ], { optional: true })
            ]),
            animations_1.query('fuse-content > :leave', animations_1.animateChild(), { optional: true }),
            animations_1.query('fuse-content > :enter', animations_1.animateChild(), { optional: true })
        ])
    ]),
    animations_1.trigger('routerTransitionDown', [
        animations_1.transition('* => *', [
            animations_1.query('fuse-content > :enter, fuse-content > :leave', [
                animations_1.style({
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0
                })
            ], { optional: true }),
            animations_1.query('fuse-content > :enter', [
                animations_1.style({
                    transform: 'translateY(-100%)',
                    opacity: 0
                })
            ], { optional: true }),
            animations_1.sequence([
                animations_1.group([
                    animations_1.query('fuse-content > :leave', [
                        animations_1.style({
                            transform: 'translateY(0)',
                            opacity: 1
                        }),
                        animations_1.animate('600ms cubic-bezier(0.0, 0.0, 0.2, 1)', animations_1.style({
                            transform: 'translateY(100%)',
                            opacity: 0
                        }))
                    ], { optional: true }),
                    animations_1.query('fuse-content > :enter', [
                        animations_1.style({ transform: 'translateY(-100%)' }),
                        animations_1.animate('600ms cubic-bezier(0.0, 0.0, 0.2, 1)', animations_1.style({
                            transform: 'translateY(0%)',
                            opacity: 1
                        }))
                    ], { optional: true })
                ]),
                animations_1.query('fuse-content > :leave', animations_1.animateChild(), { optional: true }),
                animations_1.query('fuse-content > :enter', animations_1.animateChild(), { optional: true })
            ])
        ])
    ]),
    animations_1.trigger('routerTransitionFade', [
        animations_1.transition('* => *', animations_1.group([
            animations_1.query('fuse-content > :enter, fuse-content > :leave ', [
                animations_1.style({
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0
                })
            ], { optional: true }),
            animations_1.query('fuse-content > :enter', [
                animations_1.style({
                    opacity: 0
                })
            ], { optional: true }),
            animations_1.query('fuse-content > :leave', [
                animations_1.style({
                    opacity: 1
                }),
                animations_1.animate('300ms cubic-bezier(0.0, 0.0, 0.2, 1)', animations_1.style({
                    opacity: 0
                }))
            ], { optional: true }),
            animations_1.query('fuse-content > :enter', [
                animations_1.style({
                    opacity: 0
                }),
                animations_1.animate('300ms cubic-bezier(0.0, 0.0, 0.2, 1)', animations_1.style({
                    opacity: 1
                }))
            ], { optional: true }),
            animations_1.query('fuse-content > :enter', animations_1.animateChild(), { optional: true }),
            animations_1.query('fuse-content > :leave', animations_1.animateChild(), { optional: true })
        ]))
    ])
];
