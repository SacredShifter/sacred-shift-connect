import React from 'react';
import { CollectiveField } from '@/modules/collective/CollectiveReceiver';
import { Card } from '@/components/ui/card';

interface CollectiveStatsProps {
    collectiveField: CollectiveField | null;
    coherence: number;
    latency: number; // in ms
}

export const CollectiveStats: React.FC<CollectiveStatsProps> = ({ collectiveField, coherence, latency }) => {
    if (!collectiveField) {
        return null;
    }

    const peerCount = collectiveField.nodeCount;
    const coherencePercentage = Math.round(coherence * 100);

    return (
        <Card className="fixed bottom-4 right-4 bg-indigo-950/60 border border-indigo-500 mt-4 rounded-2xl p-4 text-center text-white">
            <p className="text-indigo-300">👥 Peers: {peerCount}</p>
            <p className="text-indigo-200">✨ Coherence: {coherencePercentage}%</p>
            <p className={`text-sm ${
                latency < 30 ? "text-green-400" : latency < 100 ? "text-yellow-400" : "text-red-400"
            }`}>
                ⏱ Latency: {latency}ms
            </p>
        </Card>
    );
};
