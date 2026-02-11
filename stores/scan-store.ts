import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Detection } from "../api/detection";

const SCANS_KEY = "scan_history";
const SETTINGS_KEY = "app_settings";

export interface ScanRecord {
  id: string;
  timestamp: number;
  type: "image" | "video";
  totalDetections: number;
  healthyCount: number;
  damageCount: number;
  healthPercentage: number;
  detections: Detection[];
  annotatedUrl: string;
  sourceUri: string;
}

export interface AppSettings {
  confidence: number;
  apiUrl: string;
  autoSave: boolean;
  imageQuality: "high" | "medium" | "low";
}

const DEFAULT_SETTINGS: AppSettings = {
  confidence: 0.5,
  apiUrl: "http://192.168.1.100:8000",
  autoSave: true,
  imageQuality: "high",
};

// --- Scan History ---

export async function getScans(): Promise<ScanRecord[]> {
  const data = await AsyncStorage.getItem(SCANS_KEY);
  if (!data) return [];
  const scans: ScanRecord[] = JSON.parse(data);
  return scans.sort((a, b) => b.timestamp - a.timestamp);
}

export async function saveScan(scan: ScanRecord): Promise<void> {
  const scans = await getScans();
  scans.unshift(scan);
  await AsyncStorage.setItem(SCANS_KEY, JSON.stringify(scans));
}

export async function deleteScan(id: string): Promise<void> {
  const scans = await getScans();
  const filtered = scans.filter((s) => s.id !== id);
  await AsyncStorage.setItem(SCANS_KEY, JSON.stringify(filtered));
}

export async function clearScans(): Promise<void> {
  await AsyncStorage.removeItem(SCANS_KEY);
}

export function createScanRecord(
  detections: Detection[],
  annotatedUrl: string,
  sourceUri: string,
  type: "image" | "video" = "image"
): ScanRecord {
  const healthyCount = detections.filter((d) => d.class === "healthy").length;
  const damageCount = detections.filter((d) => d.class === "damage").length;
  const total = detections.length;

  return {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    timestamp: Date.now(),
    type,
    totalDetections: total,
    healthyCount,
    damageCount,
    healthPercentage: total > 0 ? Math.round((healthyCount / total) * 100) : 0,
    detections,
    annotatedUrl,
    sourceUri,
  };
}

// --- Settings ---

export async function getSettings(): Promise<AppSettings> {
  const data = await AsyncStorage.getItem(SETTINGS_KEY);
  if (!data) return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
}

export async function saveSettings(
  settings: Partial<AppSettings>
): Promise<AppSettings> {
  const current = await getSettings();
  const updated = { ...current, ...settings };
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  return updated;
}
