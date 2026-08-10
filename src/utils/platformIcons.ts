import type { Platform } from '../db/schema';

export interface PlatformConfig {
  name: Platform;
  color: string;
  badgeBg: string;
  badgeText: string;
  schemePrefix?: (phone?: string) => string;
}

export const PLATFORM_MAP: Record<Platform, PlatformConfig> = {
  iMessage: {
    name: 'iMessage',
    color: '#007AFF',
    badgeBg: 'rgba(0, 122, 255, 0.12)',
    badgeText: '#007AFF',
    schemePrefix: (phone) => phone ? `sms:${phone}` : `sms:`,
  },
  WhatsApp: {
    name: 'WhatsApp',
    color: '#25D366',
    badgeBg: 'rgba(37, 211, 102, 0.15)',
    badgeText: '#1E9A4B',
    schemePrefix: (phone) => phone ? `https://wa.me/${phone.replace(/[^0-9]/g, '')}` : `https://wa.me/`,
  },
  WeChat: {
    name: 'WeChat',
    color: '#07C160',
    badgeBg: 'rgba(7, 193, 96, 0.15)',
    badgeText: '#07C160',
    schemePrefix: () => `weixin://`,
  },
  FaceTime: {
    name: 'FaceTime',
    color: '#34C759',
    badgeBg: 'rgba(52, 199, 89, 0.15)',
    badgeText: '#248A3D',
    schemePrefix: (phone) => phone ? `facetime:${phone}` : `facetime:`,
  },
  Call: {
    name: 'Call',
    color: '#30D158',
    badgeBg: 'rgba(48, 209, 88, 0.15)',
    badgeText: '#248A3D',
    schemePrefix: (phone) => phone ? `tel:${phone}` : `tel:`,
  },
};

export function getPlatformBadgeStyle(platform?: Platform) {
  if (!platform || !PLATFORM_MAP[platform]) {
    return {
      background: 'rgba(142, 142, 147, 0.12)',
      color: '#8E8E93',
    };
  }
  const config = PLATFORM_MAP[platform];
  return {
    background: config.badgeBg,
    color: config.badgeText,
  };
}

export function launchPlatformApp(platform: Platform, phone?: string) {
  const config = PLATFORM_MAP[platform];
  if (config && config.schemePrefix) {
    const url = config.schemePrefix(phone);
    window.open(url, '_blank');
  }
}
