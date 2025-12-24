"use client"

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { featureDetails, type FeatureDetail } from '@/data/feature-details'

type FeaturePopupProps = {
  isOpen: boolean
  onClose: () => void
  featureId: string
}

export function FeaturePopup({ isOpen, onClose, featureId }: FeaturePopupProps) {
  const popupRef = useRef<HTMLDivElement>(null)
  const feature = featureDetails[featureId]

  // Handle ESC key to close popup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Handle clicking outside to close popup
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node) && isOpen) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  // Focus trap
  useEffect(() => {
    if (isOpen && popupRef.current) {
      popupRef.current.focus()
    }
  }, [isOpen])

  if (!feature) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            aria-hidden="true"
          />

          {/* Popup */}
          <motion.div
            ref={popupRef}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-xl max-h-[80vh] z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="feature-popup-title"
            tabIndex={-1}
            id={`feature-popup-${featureId}`}
          >
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 id="feature-popup-title" className="text-2xl font-bold gradient-text">
                  {feature.title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  aria-label="Close popup"
                >
                  <X className="w-5 h-5 text-white/70" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <p className="text-white/80 mb-6">
                  {feature.description}
                </p>

                <h3 className="text-lg font-semibold text-white mb-3">Key Features</h3>
                <ul className="space-y-2 mb-6">
                  {feature.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start text-white/70">
                      <span className="mr-2 text-white/40">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                {feature.shortcuts && (
                  <>
                    <h3 className="text-lg font-semibold text-white mb-3">Keyboard Shortcuts</h3>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {feature.shortcuts.map((shortcut, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-white/70">{shortcut.description}</span>
                          <kbd className="px-2 py-1 bg-white/10 rounded text-xs text-white/80 border border-white/10">
                            {shortcut.key}
                          </kbd>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-white/10 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md text-white/80 hover:text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default FeaturePopup 