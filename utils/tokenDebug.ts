import AsyncStorage from '@react-native-async-storage/async-storage';
import crashlytics from '@react-native-firebase/crashlytics';

/**
 * 로그인이 약 2주마다 풀리는 문제를 추적하기 위한 진단 로깅.
 * 원문 토큰은 절대 남기지 않고, 끝 6자 지문(fp)과 만료 시각만 기록한다.
 */

const AUTH_LOG_KEY = 'authDebugLog';
const AUTH_LOG_LIMIT = 50;

export interface TokenInfo {
  present: boolean;
  /** 토큰 끝 6자. rotation 여부는 이 값의 변화로 판정한다. */
  fp?: string;
  exp?: string;
  expiresInMin?: number;
}

function decodeBase64(input: string): string | null {
  const globalAtob = (globalThis as { atob?: (data: string) => string }).atob;
  if (globalAtob) {
    try {
      return globalAtob(input);
    } catch {
      return null;
    }
  }

  // Hermes에 atob이 없는 런타임을 위한 폴백
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let output = '';
  let buffer = 0;
  let bits = 0;

  for (const char of input) {
    const index = chars.indexOf(char);
    if (index === -1) continue;
    buffer = (buffer << 6) | index;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      output += String.fromCharCode((buffer >> bits) & 0xff);
    }
  }

  return output;
}

/** JWT 페이로드를 디코드한다. 진단 코드가 앱을 죽이면 안 되므로 실패 시 null. */
export function decodeJwtPayload(
  token: string,
): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;

    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      '=',
    );

    const json = decodeBase64(padded);
    return json ? JSON.parse(json) : null;
  } catch {
    return null;
  }
}

export function describeToken(token: string | null | undefined): TokenInfo {
  if (!token) return { present: false };

  const info: TokenInfo = { present: true, fp: token.slice(-6) };
  const payload = decodeJwtPayload(token);
  const exp = payload?.exp;

  if (typeof exp === 'number') {
    const expiresAt = exp * 1000;
    info.exp = new Date(expiresAt).toISOString();
    info.expiresInMin = Math.round((expiresAt - Date.now()) / 60000);
  }

  return info;
}

async function appendToRingBuffer(entry: Record<string, unknown>) {
  try {
    const raw = await AsyncStorage.getItem(AUTH_LOG_KEY);
    const entries: unknown[] = raw ? JSON.parse(raw) : [];
    entries.push(entry);
    await AsyncStorage.setItem(
      AUTH_LOG_KEY,
      JSON.stringify(entries.slice(-AUTH_LOG_LIMIT)),
    );
  } catch (e) {
    console.warn('[AUTH] 로그 버퍼 저장 실패', e);
  }
}

/**
 * 콘솔 + Crashlytics + 기기 링 버퍼에 동시에 기록한다.
 * 재현에 2주가 걸리므로 실사용자 로그가 Crashlytics로 올라가야 한다.
 */
export function logAuthEvent(event: string, payload?: Record<string, unknown>) {
  const at = new Date().toISOString();

  console.log('[AUTH]', event, payload ?? '');

  try {
    crashlytics().log(`[AUTH] ${event} ${JSON.stringify(payload ?? {})}`);
  } catch (e) {
    console.warn('[AUTH] crashlytics 로그 실패', e);
  }

  void appendToRingBuffer({ at, event, ...payload });
}

/** 기기에 쌓인 최근 인증 이벤트를 콘솔에 출력한다. */
export async function dumpAuthLog(): Promise<unknown[]> {
  try {
    const raw = await AsyncStorage.getItem(AUTH_LOG_KEY);
    const entries: unknown[] = raw ? JSON.parse(raw) : [];
    console.log('[AUTH] === 최근 인증 이벤트', entries.length, '건 ===');
    entries.forEach((entry) => console.log('[AUTH]', entry));
    return entries;
  } catch (e) {
    console.warn('[AUTH] 로그 덤프 실패', e);
    return [];
  }
}
