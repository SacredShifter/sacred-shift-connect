// Law of Transfer API Client
// Handles all database operations for the Law of Transfer feature pack

import { supabase } from "@/integrations/supabase/client";
import type { Vision, VisionMorph, BreathSession, TransferEvent, CodexPrinciple } from "@/types/transfer";

// Vision operations
export async function createVision(payload: Partial<Vision>): Promise<Vision> {
  const { data, error } = await supabase.from("visions").insert(payload).select().single();
  if (error) throw error;
  return data as Vision;
}

export async function listVisions(): Promise<Vision[]> {
  const { data, error } = await supabase.from("visions").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data as Vision[];
}

export async function getVision(id: string): Promise<Vision> {
  const { data, error } = await supabase.from("visions").select("*").eq("id", id).single();
  if (error) throw error;
  return data as Vision;
}

export async function updateVision(id: string, updates: Partial<Vision>): Promise<Vision> {
  const { data, error } = await supabase.from("visions").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data as Vision;
}

export async function deleteVision(id: string): Promise<void> {
  const { error } = await supabase.from("visions").delete().eq("id", id);
  if (error) throw error;
}

// Vision morph operations
export async function addVisionMorph(payload: Partial<VisionMorph>): Promise<VisionMorph> {
  const { data, error } = await supabase.from("vision_morphs").insert(payload).select().single();
  if (error) throw error;
  return data as VisionMorph;
}

export async function getVisionMorphs(visionId: string): Promise<VisionMorph[]> {
  const { data, error } = await supabase.from("vision_morphs").select("*").eq("vision_id", visionId).order("created_at", { ascending: true });
  if (error) throw error;
  return data as VisionMorph[];
}

export async function updateVisionMorph(id: string, updates: Partial<VisionMorph>): Promise<VisionMorph> {
  const { data, error } = await supabase.from("vision_morphs").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data as VisionMorph;
}

export async function deleteVisionMorph(id: string): Promise<void> {
  const { error } = await supabase.from("vision_morphs").delete().eq("id", id);
  if (error) throw error;
}

// Breath session operations
export async function startBreathSession(payload: Partial<BreathSession>): Promise<BreathSession> {
  const { data, error } = await supabase.from("breath_sessions").insert(payload).select().single();
  if (error) throw error;
  return data as BreathSession;
}

export async function finishBreathSession(id: string, updates: Partial<BreathSession>): Promise<BreathSession> {
  const { data, error } = await supabase.from("breath_sessions").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data as BreathSession;
}

export async function listBreathSessions(): Promise<BreathSession[]> {
  const { data, error } = await supabase.from("breath_sessions").select("*").order("started_at", { ascending: false });
  if (error) throw error;
  return data as BreathSession[];
}

export async function getBreathSession(id: string): Promise<BreathSession> {
  const { data, error } = await supabase.from("breath_sessions").select("*").eq("id", id).single();
  if (error) throw error;
  return data as BreathSession;
}

// Codex operations
export async function getCodexPrinciple(slug: string): Promise<CodexPrinciple> {
  const { data, error } = await supabase.from("codex_principles").select("*").eq("slug", slug).single();
  if (error) throw error;
  return data as CodexPrinciple;
}

export async function listCodexPrinciples(): Promise<CodexPrinciple[]> {
  const { data, error } = await supabase.from("codex_principles").select("*").order("created_at", { ascending: true });
  if (error) throw error;
  return data as CodexPrinciple[];
}

// Telemetry operations
export async function logTransferEvent(kind: string, props: Record<string, unknown> = {}): Promise<void> {
  const { error } = await supabase.from("transfer_events").insert({ kind, props });
  if (error) throw error;
}

export async function getTransferEvents(limit: number = 100): Promise<TransferEvent[]> {
  const { data, error } = await supabase.from("transfer_events").select("*").order("created_at", { ascending: false }).limit(limit);
  if (error) throw error;
  return data as TransferEvent[];
}
