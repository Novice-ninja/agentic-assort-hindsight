import { useState, useRef, useEffect } from "react";
const useTextOverflow = (deps = []) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef(null);
  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        const element = textRef.current;
        const isTextOverflowing = element.scrollWidth > element.clientWidth;
        setIsOverflowing(isTextOverflowing);
      }
    };
    checkOverflow();
    const resizeObserver = new ResizeObserver(checkOverflow);
    if (textRef.current) {
      resizeObserver.observe(textRef.current);
    }
    return () => {
      resizeObserver.disconnect();
    };
  }, deps);
  return { textRef, isOverflowing };
};
export {
  useTextOverflow
};
