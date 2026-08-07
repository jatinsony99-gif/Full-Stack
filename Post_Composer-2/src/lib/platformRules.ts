export type PlatformId = "twitter" | "facebook" | "linkedin" | "instagram";

export interface PlatformRule {
  id: PlatformId;
  name: string;
  description: string;
  maxLength: number;
  warningThreshold: number;
  requiresMedia?: boolean;
}

export interface ValidationIssue {
  level: "error" | "warning";
  message: string;
}

export interface PlatformValidationResult {
  platformId: PlatformId;
  maxLength: number;
  charCount: number;
  charRemaining: number;
  hashtagCount: number;
  isValid: boolean;
  issues: ValidationIssue[];
}

export const platformRules: Record<PlatformId, PlatformRule> = {
  twitter: {
    id: "twitter",
    name: "Twitter",
    description: "Short, punchy updates with a strict character cap.",
    maxLength: 280,
    warningThreshold: 240
  },
  facebook: {
    id: "facebook",
    name: "Facebook",
    description: "Longer posts with more room for context and media.",
    maxLength: 63206,
    warningThreshold: 5000
  },
  linkedin: {
    id: "linkedin",
    name: "LinkedIn",
    description: "Professional messaging with a polished tone.",
    maxLength: 3000,
    warningThreshold: 2200
  },
  instagram: {
    id: "instagram",
    name: "Instagram",
    description: "Visual-first posts that usually pair well with media.",
    maxLength: 2200,
    warningThreshold: 1800,
    requiresMedia: true
  }
};

export function validatePostContent(
  content: string,
  mediaCount: number,
  platformId: PlatformId
): PlatformValidationResult {
  const rule = platformRules[platformId];
  const charCount = content.length;
  const hashtagCount = (content.match(/(^|\s)#\w+/g) ?? []).length;
  const issues: ValidationIssue[] = [];

  if (charCount > rule.maxLength) {
    issues.push({
      level: "error",
      message: `This exceeds the ${rule.maxLength}-character limit.`
    });
  } else if (charCount > rule.warningThreshold) {
    issues.push({
      level: "warning",
      message: `You are approaching the ${rule.maxLength}-character limit.`
    });
  }

  if (platformId === "twitter" && hashtagCount > 2) {
    issues.push({
      level: "warning",
      message: "Twitter posts perform best with fewer than three hashtags."
    });
  }

  if (rule.requiresMedia && mediaCount === 0) {
    issues.push({
      level: "warning",
      message: "Instagram posts are stronger when paired with media."
    });
  }

  return {
    platformId,
    maxLength: rule.maxLength,
    charCount,
    charRemaining: Math.max(rule.maxLength - charCount, 0),
    hashtagCount,
    isValid: issues.every((issue) => issue.level !== "error"),
    issues
  };
}
