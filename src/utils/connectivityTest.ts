// Sacred Connectivity Test - Verify WebSocket connection fix
// This test validates that the WebRTC mesh can connect to Supabase signaling server

import { SacredWebRTCMesh, WebRTCMeshConfig } from '../lib/connectivity/SacredWebRTCMesh';

export async function testConnectivity(): Promise<boolean> {
  console.log('🧪 Testing Sacred Connectivity System...');

  try {
    // Create test configuration
    const config: WebRTCMeshConfig = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ],
      meshId: 'test-mesh',
      maxPeers: 10,
      heartbeatInterval: 30000,
      connectionTimeout: 60000,
      enableMeshRouting: true,
      enableNATTraversal: true
    };

    // Create WebRTC mesh instance
    const mesh = new SacredWebRTCMesh(config);

    // Set up message handler
    mesh.onMessage((message) => {
      console.log('📨 Test message received:', message);
    });

    // Initialize the mesh (this will test the WebSocket connection)
    await mesh.initialize();

    console.log('✅ Sacred Connectivity Test PASSED - WebSocket connection successful');
    
    // Clean up
    await mesh.shutdown();
    
    return true;
  } catch (error) {
    console.error('❌ Sacred Connectivity Test FAILED:', error);
    return false;
  }
}

// Export for use in components
export default testConnectivity;