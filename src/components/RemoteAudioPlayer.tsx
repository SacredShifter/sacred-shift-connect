import React, { useEffect, useRef } from 'react';

interface RemoteAudioPlayerProps {
  streams: { [key: string]: MediaStream };
}

const AudioStream: React.FC<{ stream: MediaStream }> = ({ stream }) => {
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.srcObject = stream;
        }
    }, [stream]);

    return <audio ref={audioRef} autoPlay />;
};


export const RemoteAudioPlayer: React.FC<RemoteAudioPlayerProps> = ({ streams }) => {
  return (
    <div style={{ display: 'none' }}>
      {Object.entries(streams).map(([userId, stream]) => (
        <AudioStream key={userId} stream={stream} />
      ))}
    </div>
  );
};
