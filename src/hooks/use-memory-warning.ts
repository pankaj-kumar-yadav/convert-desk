"use client";

import { useState, useEffect } from "react";

export function useMemoryWarning() {
  const [showMemoryWarning, setShowMemoryWarning] = useState(false);
  const [memoryUsage, setMemoryUsage] = useState(0);

  useEffect(() => {
    // Check memory usage if the browser supports the performance API
    const checkMemory = () => {
      if ("performance" in window && "memory" in (performance as any)) {
        const memory = (performance as any).memory;
        if (memory && memory.jsHeapSizeLimit) {
          const usedHeap = memory.usedJSHeapSize;
          const totalHeap = memory.jsHeapSizeLimit;
          const usagePercentage = Math.round((usedHeap / totalHeap) * 100);

          setMemoryUsage(usagePercentage);
          setShowMemoryWarning(usagePercentage > 70); // Show warning if over 70%
        }
      }
    };

    // Check memory usage initially and every 30 seconds
    checkMemory();
    const interval = setInterval(checkMemory, 30000);

    return () => clearInterval(interval);
  }, []);

  return { showMemoryWarning, memoryUsage };
}
