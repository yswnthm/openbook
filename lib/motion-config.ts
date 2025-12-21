/**
 * Motion Configuration System for OpenBook
 * Implements the Slide & Settle motion pattern as defined in specs/motion-design.md
 */

/**
 * Interface for animation configuration options
 */
export interface AnimationConfig {
    transition: {
        ease: number[];
        duration: number;
    };
    spring: {
        type: string;
        stiffness: number;
        damping: number;
    };
    fade: {
        initial: { opacity: number };
        animate: { opacity: number };
        exit: { opacity: number };
        transition: { duration: number };
    };
    hover: {
        scale: number;
        x?: number;
        transition: { duration: number };
    };
    tap: {
        scale: number;
    };
}

/**
 * Standard animation configuration for the application
 */
export const animationConfig: AnimationConfig = {
    // Standard transition preset
    transition: {
        ease: [0.25, 0.1, 0.25, 1], // Cubic bezier curve
        duration: 0.3, // 300ms duration
    },

    // Spring configuration
    spring: {
        type: 'spring',
        stiffness: 400,
        damping: 30,
    },

    // Fade in/out preset
    fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.2 },
    },

    // Hover animation preset
    hover: {
        scale: 1.02,
        x: 3, // Consistent "nudge" effect
        transition: { duration: 0.2 },
    },

    // Tap animation preset
    tap: {
        scale: 0.98,
    },
};

/**
 * Panel expansion/collapse animation variants
 */
const panelVariants = {
    open: {
        height: 'auto',
        opacity: 1,
        transition: {
            height: {
                type: 'spring',
                stiffness: 400,
                damping: 30,
            },
        },
    },
    closed: {
        height: 0,
        opacity: 0,
        transition: {
            height: {
                type: 'spring',
                stiffness: 400,
                damping: 30,
            },
        },
    },
};

/**
 * Modal animation variants
 */
const modalVariants = {
    initial: { opacity: 0, scale: 0.95, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.98, y: 10 },
    transition: animationConfig.spring,
};
