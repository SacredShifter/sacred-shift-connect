import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, BookOpen, Sparkles } from 'lucide-react'
import { TeachingLayer } from '@/components/TeachingLayer'
import { ALL_MODULE_TEACHINGS } from '@/data/allModuleTeachings'

const vertexShader = `
  uniform float u_time;
  uniform float u_amp;
  uniform float u_freq;

  void main() {
    vec3 pos = position;
    float wave = sin(u_time * (u_freq / 200.0) + pos.x * 1.2 + pos.y * 1.3 + pos.z * 1.4);
    pos.y += wave * 0.05 * u_amp;

    vec4 modelViewPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * modelViewPosition;
    gl_PointSize = 3.0;
  }
`

const fragmentShader = `
  void main() {
    gl_FragColor = vec4(0.65, 0.95, 0.81, 1.0); // #a7f3d0
  }
`

function Particles({ amp, freq }: { amp: number, freq: number }){
  const pointsRef = useRef<THREE.Points>(null!)

  const [geometry, material] = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const count = 100;
    const size = 4;
    const pos = new Float32Array(count * count * 3);
    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        const index = (i * count + j) * 3;
        pos[index] = (i / count - 0.5) * size;
        pos[index + 1] = (j / count - 0.5) * size;
        pos[index + 2] = 0;
      }
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const m = new THREE.ShaderMaterial({
      uniforms: { u_time: { value: 0 }, u_amp: { value: amp }, u_freq: { value: freq } },
      vertexShader,
      fragmentShader,
    });
    return [g, m];
  }, [amp, freq]);

  useFrame(({clock})=>{
    if (material) {
      material.uniforms.u_time.value = clock.getElapsedTime()
      material.uniforms.u_amp.value = amp
      material.uniforms.u_freq.value = freq
    }
  })

  return <points ref={pointsRef} geometry={geometry} material={material} />
}

export default function Vibration(){
  const [freq, setFreq] = useState(440)
  const [amp, setAmp] = useState(0.3)
  const [showInfo, setShowInfo] = useState(false)
  const [showDeeperKnowledge, setShowDeeperKnowledge] = useState(false)
  const audio = useRef<{ ctx: AudioContext, osc: OscillatorNode, gain: GainNode } | null>(null);

  useEffect(() => {
    if (!audio.current) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain).connect(ctx.destination)
      osc.start()
      audio.current = { ctx, osc, gain };
    }
    if (audio.current) {
      audio.current.osc.frequency.setValueAtTime(freq, audio.current.ctx.currentTime);
      audio.current.gain.gain.setValueAtTime(amp * 0.05, audio.current.ctx.currentTime);
    }
    return () => {
      if (audio.current) {
        audio.current.osc.stop();
        audio.current.ctx.close();
        audio.current = null;
      }
    }
  }, [freq, amp])

  return (
    <div className="w-screen h-screen relative">
      <Canvas camera={{ position:[0,0,5] }}>
        <color attach="background" args={["#0b0c10"]} />
        <ambientLight intensity={0.6} />
        <Particles amp={amp} freq={freq} />
      </Canvas>
      <div className="absolute top-4 left-4 space-y-2 bg-black/50 p-4 rounded-lg w-80 border border-white/10">
        <h2 className="text-xl text-white font-bold">The Principle of Vibration</h2>
        <p className="text-xs opacity-80 pb-2">"Nothing rests; everything moves; everything vibrates."</p>

        <label className="block text-sm pt-2">Frequency: {freq.toFixed(0)} Hz</label>
        <input type="range" min={110} max={880} step={1} value={freq} onChange={e=>setFreq(parseFloat(e.target.value))} className="w-full" />
        <label className="block text-sm pt-2">Amplitude</label>
        <input type="range" min={0} max={1} step={0.01} value={amp} onChange={e=>setAmp(parseFloat(e.target.value))} className="w-full" />

        <Button onClick={() => setShowInfo(!showInfo)} variant="outline" size="sm" className="w-full mt-2">
            <BookOpen className="h-4 w-4 mr-2" />
            Learn More
            <ChevronDown className={`h-4 w-4 ml-auto transition-transform ${showInfo ? 'rotate-180' : ''}`} />
        </Button>

        <AnimatePresence>
        {showInfo && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="pt-4 mt-4 border-t border-white/10 text-sm text-white/90 space-y-3">
                    <p>This principle explains that the differences between manifestations of matter, energy, and even spirit are the result of varying rates of vibration. From the highest plane to the densest matter, everything is in motion.</p>
                    <p><strong className="text-purple-300">Application:</strong> You can change your mental and emotional state by changing your vibration. Use music, chanting, or focused breathing to raise your frequency from a state of fear to a state of love or courage.</p>
                    <p><strong className="text-purple-300">Reflection:</strong> What in my life has a "low" vibration that I wish to raise? What has a "high" vibration that I want to cultivate?</p>
                </div>
            </motion.div>
        )}
        </AnimatePresence>
      </div>

      {/* Deeper Knowledge Section - Positioned prominently */}
      <div className="absolute bottom-4 right-4 w-80">
        <div className="bg-gradient-to-r from-cyan-500/20 via-teal-500/20 to-emerald-500/20 backdrop-blur-sm border border-cyan-400/30 rounded-xl p-4">
          <Button
            onClick={() => setShowDeeperKnowledge(!showDeeperKnowledge)}
            className="w-full bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-700 hover:to-emerald-700 text-white font-semibold py-3 text-lg gap-3 shadow-lg hover:shadow-xl transition-all duration-300"
            size="lg"
          >
            <Sparkles className="w-5 h-5" />
            {showDeeperKnowledge ? 'Hide' : 'Unlock'} Sacred Wisdom
            <BookOpen className="w-5 h-5" />
          </Button>
          
          {showDeeperKnowledge && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 max-h-96 overflow-y-auto"
            >
              <TeachingLayer
                content={ALL_MODULE_TEACHINGS.vibration}
                moduleId="vibration"
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
