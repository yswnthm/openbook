import { ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    className?: string;
    overlayClassName?: string;
    showCloseButton?: boolean;
    closeOnOverlayClick?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({
    isOpen,
    onClose,
    children,
    className,
    overlayClassName,
    showCloseButton = false,
    closeOnOverlayClick = true,
    size = 'md',
}: ModalProps) {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
    };

    return (
        <>
            {/* Add keyframes animations for the modal */}
            <style jsx global>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.96);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                @keyframes overlayShow {
                    from {
                        opacity: 0;
                        backdrop-filter: blur(0px);
                    }
                    to {
                        opacity: 1;
                        backdrop-filter: blur(2px);
                    }
                }
            `}</style>

            <div
                className={cn(
                    'fixed inset-0 bg-black/10 backdrop-blur-[2px] z-50 flex items-center justify-center p-4',
                    overlayClassName,
                )}
                onClick={closeOnOverlayClick ? onClose : undefined}
                style={{ animation: 'overlayShow 0.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
            >
                <div
                    className={cn(
                        'bg-white dark:bg-neutral-900 rounded-md shadow-sm w-full transform transition-all ease-out duration-300 border border-neutral-200 dark:border-neutral-800',
                        sizeClasses[size],
                        className,
                    )}
                    style={{ animation: 'fadeIn 0.2s ease-out' }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {showCloseButton && (
                        <div className="absolute top-3 right-3">
                            <button
                                onClick={onClose}
                                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                    {children}
                </div>
            </div>
        </>
    );
}
