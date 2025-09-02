import { describe, it, expect, vi } from 'vitest';
import { parseYouTubeExternalId, resolveHandleToChannelId } from '@/lib/youtube';

describe('lib/youtube', () => {
  describe('parseYouTubeExternalId', () => {
    it('should parse channel URL', () => {
      const result = parseYouTubeExternalId('https://www.youtube.com/channel/UC-lHJZR3Gqxm24_Vd_AJ5Yw');
      expect(result).toEqual({ channelId: 'UC-lHJZR3Gqxm24_Vd_AJ5Yw' });
    });

    it('should parse handle URL', () => {
      const result = parseYouTubeExternalId('https://www.youtube.com/@sacredshifter');
      expect(result).toEqual({ handle: 'sacredshifter' });
    });

    it('should parse handle with @', () => {
      const result = parseYouTubeExternalId('@sacredshifter');
      expect(result).toEqual({ handle: 'sacredshifter' });
    });

    it('should parse handle without @', () => {
      const result = parseYouTubeExternalId('sacredshifter');
      expect(result).toEqual({ handle: 'sacredshifter' });
    });

    it('should return empty for invalid URL', () => {
      const result = parseYouTubeExternalId('https://www.google.com');
      expect(result).toEqual({});
    });
  });

  describe('resolveHandleToChannelId', () => {
    it('should return a mock channel ID', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const channelId = await resolveHandleToChannelId('test-handle');
      expect(channelId).toBe('UC_mock_test-handle_ID');
      expect(consoleSpy).toHaveBeenCalledWith('[YouTube] Mock resolving handle: @test-handle. Using mock ID.');
      consoleSpy.mockRestore();
    });
  });
});
