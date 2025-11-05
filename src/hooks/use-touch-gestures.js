import { useEffect, useRef } from 'react';

/**
 * USE TOUCH GESTURES HOOK
 *
 * Custom hook for handling touch gestures like swipe, pinch, and long press.
 * Optimized for tablet presentations and mobile devices.
 *
 * @param {Object} callbacks - Gesture callback functions
 * @param {Function} callbacks.onSwipeLeft - Called when user swipes left
 * @param {Function} callbacks.onSwipeRight - Called when user swipes right
 * @param {Function} callbacks.onSwipeUp - Called when user swipes up
 * @param {Function} callbacks.onSwipeDown - Called when user swipes down
 * @param {Function} callbacks.onPinchIn - Called when user pinches in (zoom out)
 * @param {Function} callbacks.onPinchOut - Called when user pinches out (zoom in)
 * @param {Function} callbacks.onLongPress - Called when user long presses
 * @param {Function} callbacks.onDoubleTap - Called when user double taps
 * @param {Object} options - Configuration options
 * @param {number} options.swipeThreshold - Minimum distance for swipe (default: 50)
 * @param {number} options.longPressDuration - Duration for long press in ms (default: 500)
 * @param {number} options.doubleTapDelay - Max delay between taps in ms (default: 300)
 */
export default function useTouchGestures(callbacks = {}, options = {}) {
  const touchStart = useRef({ x: 0, y: 0, time: 0 });
  const touchEnd = useRef({ x: 0, y: 0 });
  const lastTap = useRef(0);
  const longPressTimer = useRef(null);
  const initialPinchDistance = useRef(0);

  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onPinchIn,
    onPinchOut,
    onLongPress,
    onDoubleTap,
  } = callbacks;

  const {
    swipeThreshold = 50,
    longPressDuration = 500,
    doubleTapDelay = 300,
  } = options;

  useEffect(() => {
    const handleTouchStart = (e) => {
      // Record touch start position and time
      if (e.touches.length === 1) {
        touchStart.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          time: Date.now(),
        };

        // Start long press timer
        if (onLongPress) {
          longPressTimer.current = setTimeout(() => {
            onLongPress(e);
          }, longPressDuration);
        }
      } else if (e.touches.length === 2 && (onPinchIn || onPinchOut)) {
        // Record initial pinch distance
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialPinchDistance.current = Math.sqrt(dx * dx + dy * dy);
      }
    };

    const handleTouchMove = (e) => {
      // Cancel long press if finger moves
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }

      // Handle pinch gesture
      if (e.touches.length === 2 && (onPinchIn || onPinchOut)) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDistance = Math.sqrt(dx * dx + dy * dy);

        const distanceChange = currentDistance - initialPinchDistance.current;

        if (Math.abs(distanceChange) > 10) {
          if (distanceChange < 0 && onPinchIn) {
            onPinchIn(e, distanceChange);
          } else if (distanceChange > 0 && onPinchOut) {
            onPinchOut(e, distanceChange);
          }
          initialPinchDistance.current = currentDistance;
        }
      }
    };

    const handleTouchEnd = (e) => {
      // Cancel long press timer
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }

      if (e.changedTouches.length === 1) {
        touchEnd.current = {
          x: e.changedTouches[0].clientX,
          y: e.changedTouches[0].clientY,
        };

        // Calculate swipe distance
        const deltaX = touchEnd.current.x - touchStart.current.x;
        const deltaY = touchEnd.current.y - touchStart.current.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // Check for swipe gestures
        if (distance > swipeThreshold) {
          const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

          // Horizontal swipe
          if (Math.abs(angle) < 45) {
            if (deltaX > 0 && onSwipeRight) {
              onSwipeRight(e);
            } else if (deltaX < 0 && onSwipeLeft) {
              onSwipeLeft(e);
            }
          }
          // Vertical swipe
          else if (Math.abs(angle) > 135) {
            if (deltaY > 0 && onSwipeDown) {
              onSwipeDown(e);
            } else if (deltaY < 0 && onSwipeUp) {
              onSwipeUp(e);
            }
          }
        }
        // Check for double tap
        else if (onDoubleTap) {
          const now = Date.now();
          if (now - lastTap.current < doubleTapDelay) {
            onDoubleTap(e);
            lastTap.current = 0; // Reset to prevent triple tap
          } else {
            lastTap.current = now;
          }
        }
      }
    };

    // Add event listeners
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Cleanup
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, [
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onPinchIn,
    onPinchOut,
    onLongPress,
    onDoubleTap,
    swipeThreshold,
    longPressDuration,
    doubleTapDelay,
  ]);

  return null;
}
