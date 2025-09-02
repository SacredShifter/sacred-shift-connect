import * as Tone from 'tone';

export class AudioStreamer {
  private audioContext: AudioContext;
  private destinationNode: MediaStreamAudioDestinationNode;
  private mediaStream: MediaStream;

  constructor() {
    this.audioContext = Tone.context.rawContext as AudioContext;
    this.destinationNode = this.audioContext.createMediaStreamDestination();
    this.mediaStream = this.destinationNode.stream;
  }

  public start() {
    // Connect Tone.js output to our destination node
    Tone.getDestination().connect(this.destinationNode);
    console.log('Audio streamer started and connected to destination node.');
  }

  public stop() {
    Tone.getDestination().disconnect(this.destinationNode);
    console.log('Audio streamer stopped.');
  }

  public getStream(): MediaStream {
    return this.mediaStream;
  }
}
