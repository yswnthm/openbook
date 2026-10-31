import React from 'react';

// Shared JSX element used by both OpenGraph and Twitter image routes
// The component renders the main interface background image hosted locally.
// A gradient background color is applied as a fallback so the image still looks acceptable
// if the local asset cannot be loaded for some reason.
export const imageSize = {
    width: 1200,
    height: 630,
};

export function renderMainOgImage() {
    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage:
                    'linear-gradient(135deg, #191919 0%, #2e2e2e 100%), url(/screenshots/main-interface.png)',
                backgroundSize: 'cover',
            }}
        ></div>
    );
}
