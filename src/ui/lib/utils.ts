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