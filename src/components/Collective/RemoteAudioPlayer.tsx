import { useEffect, useRef } from 'react';

interface RemoteAudioPlayerProps {
    stream: MediaStream;
}

export const RemoteAudioPlayer = ({ stream }: RemoteAudioPlayerProps) => {
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioRef.current && stream) {
            audioRef.current.srcObject = stream;
        }
    }, [stream]);

    return <audio ref={audioRef} autoPlay />;
};
