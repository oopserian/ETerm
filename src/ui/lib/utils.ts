import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 合并类名工具
 * 支持动态条件、重复合并及 Tailwind 优化
 *
 * @param inputs 类名列表
 * @returns 合并后的类名字符串
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


// 节流 - 适用于限制频繁触发的操作，如滚动事件、鼠标移动等。

type ThrottleOptions = {
  leading?: boolean; // 是否在开始时立即调用
  trailing?: boolean; // 是否在结束时调用一次
};

export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  wait: number,
  options: ThrottleOptions = {}
): { (this: any, ...args: Parameters<T>): void; cancel: () => void } {
  const { leading = true, trailing = true } = options;
  let lastTime = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const throttled = function (this: any, ...args: Parameters<T>) {
    const now = Date.now();
    const context = this;

    if (!lastTime && !leading) lastTime = now;

    const remaining = wait - (now - lastTime);

    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      lastTime = now;
      fn.apply(context, args);
    } else if (!timer && trailing) {
      timer = setTimeout(() => {
        timer = null;
        lastTime = leading ? Date.now() : 0;
        fn.apply(context, args);
      }, remaining);
    }
  };

  throttled.cancel = () => {
    if (timer) clearTimeout(timer);
    timer = null;
    lastTime = 0;
  };

  return throttled;
}

// 防抖 - 适用于避免连续触发操作，如输入框联想搜索、窗口调整大小等。

type DebounceOptions = {
  immediate?: boolean; // 是否在开始时立即调用
};

export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait: number,
  options: DebounceOptions = {}
): { (this: any, ...args: Parameters<T>): void; cancel: () => void } {
  const { immediate = false } = options;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let result: any;

  const debounced = function (this: any, ...args: Parameters<T>) {
    const context = this;

    if (timer) clearTimeout(timer);

    if (immediate) {
      const callNow = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, wait);
      if (callNow) result = fn.apply(context, args);
    } else {
      timer = setTimeout(() => {
        timer = null;
        result = fn.apply(context, args);
      }, wait);
    }

    return result;
  };

  debounced.cancel = () => {
    if (timer) clearTimeout(timer);
    timer = null;
  };

  return debounced;
}

