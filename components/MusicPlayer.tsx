import React, { useEffect, useRef, useState } from 'react';

interface MusicPlayerProps {
    isPlaying: boolean;
    onToggle: () => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ isPlaying, onToggle }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        // Create audio element
        const audio = new Audio('/music.mp3');
        audio.loop = true;
        audioRef.current = audio;

        audio.addEventListener('error', (e) => {
            console.warn('Music load failed:', e);
            setError(true);
        });

        return () => {
            audio.pause();
            audio.src = '';
            audioRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch((err) => {
                    console.warn('Playback prevented:', err);
                    // If blocked, we might need user interaction.
                    // Since this is triggered by gesture (webcam stream), 
                    // usually browser allows audiocontext/interaction if webcam is active,
                    // but "play()" might still need gesture.
                    // However, the user request says "gesture control starts music".
                });
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);

    if (error) return null;

    return (
        <button
            onClick={onToggle}
            className="fixed bottom-8 right-8 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-300 backdrop-blur-sm"
            title={isPlaying ? "Pause Music" : "Play Music"}
        >
            {isPlaying ? (
                // Pause Icon
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
            ) : (
                // Play Icon / Music Note
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
            )}
        </button>
    );
};
