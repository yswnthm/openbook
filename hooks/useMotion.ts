import { useState, useEffect } from 'react';
import { animationConfig, AnimationConfig } from '@/lib/motion-config';
import { useMotionContext } from '@/contexts/MotionContext';

// Type for the reduced animation settings returned by getAnimationSettings
type ReducedMotionSettings = {
    transition: Partial<AnimationConfig['transition']>;
    hover: Partial<AnimationConfig['hover']>;
    tap: Partial<AnimationConfig['tap']>;
    fade: {
        transition: Partial<AnimationConfig['fade']['transition']>;
        initial: AnimationConfig['fade']['initial'];
        animate: AnimationConfig['fade']['animate'];
        exit: AnimationConfig['fade']['exit'];
    };
};

/**
 * Get animation settings based on motion preferences
 * @returns appropriate animation settings respecting user preferences
 */
const getAnimationSettings = (disableAnimations: boolean): AnimationConfig | ReducedMotionSettings => {
    if (disableAnimations) {
        // Return minimal motion settings
        return {
            transition: { duration: 0 },
            hover: { scale: 1, x: 0 },
            tap: { scale: 1 },
            fade: {
                ...animationConfig.fade,
                transition: { duration: 0 },
            },
        };
    }

    // Return standard animation settings
    return animationConfig;
};

/**
 * Hook for accessing animation settings with support for reduced motion preferences
 * @returns Object containing animation settings and reduced motion preference
 */
export function useMotion() {
    const { prefersReducedMotion, enableAnimations } = useMotionContext();

    // Disable animations if user prefers reduced motion or explicitly disabled them
    const shouldDisableAnimations = prefersReducedMotion || !enableAnimations;

    const [animationSettings, setAnimationSettings] = useState<AnimationConfig | ReducedMotionSettings>(
        getAnimationSettings(shouldDisableAnimations),
    );

    // Update animation settings if preferences change
    useEffect(() => {
        setAnimationSettings(getAnimationSettings(shouldDisableAnimations));
    }, [shouldDisableAnimations]);

    return {
        settings: animationSettings,
        prefersReducedMotion: shouldDisableAnimations,
    };
}

/**
 * Hook for creating element transitions with reduced motion support
 * @returns Animation variants for transitions
 */
export function useElementTransition() {
    const { settings, prefersReducedMotion } = useMotion();

    // Create appropriate variants based on reduced motion preferences
    const variants = {
        initial: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 },
        animate: prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 },
        exit: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 },
        transition: prefersReducedMotion ? { duration: 0 } : settings.transition,
    };

    return variants;
}

/**
 * Hook for hover animations with reduced motion support
 * @returns Animation props for hover effects
 */
export function useHoverAnimation() {
    const { settings, prefersReducedMotion } = useMotion();

    // Return hover animation props, respecting reduced motion preferences
    return {
        whileHover: prefersReducedMotion ? undefined : { x: 3, ...settings.hover },
        whileTap: prefersReducedMotion ? undefined : settings.tap,
        transition: settings.transition,
    };
}
