import { motion, useReducedMotion } from "motion/react";

type Variant = "discovery" | "build" | "delivery";

type Props = {
  variant: Variant;
};

// Ilustrações abstratas em tokens MIV — sem clichê 3D, só contorno.
// Cor herdada via currentColor a partir das classes text-*.
export function ProcessIllustration({ variant }: Props) {
  const reduced = useReducedMotion() ?? false;
  return (
    <div className="relative mx-auto w-full max-w-[180px]">
      <svg
        viewBox="0 0 200 200"
        className="relative aspect-square w-full text-accent"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {variant === "discovery" && <DiscoveryArt reduced={reduced} />}
        {variant === "build" && <BuildArt reduced={reduced} />}
        {variant === "delivery" && <DeliveryArt reduced={reduced} />}
      </svg>
    </div>
  );
}

function DiscoveryArt({ reduced }: { reduced: boolean }) {
  const bubbleDots = [92, 100, 108];
  return (
    <g>
      {/* pessoa esquerda */}
      <g className="text-accent" stroke="currentColor">
        <motion.circle
          cx="45"
          cy="90"
          r="14"
          style={{ transformOrigin: "45px 90px" }}
          animate={reduced ? undefined : { rotate: [0, -3, 0, 2, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <path d="M20 150 c 0 -18 12 -30 25 -30 s 25 12 25 30" />
      </g>

      {/* pessoa direita */}
      <g className="text-accent-2" stroke="currentColor">
        <motion.circle
          cx="155"
          cy="90"
          r="14"
          style={{ transformOrigin: "155px 90px" }}
          animate={reduced ? undefined : { rotate: [0, 2, 0, -3, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1.6 }}
        />
        <path d="M130 150 c 0 -18 12 -30 25 -30 s 25 12 25 30" />
      </g>

      {/* bolha de diálogo entre elas — pulsa sutilmente como se estivessem conversando */}
      <motion.g
        className="text-hairline"
        stroke="currentColor"
        style={{ transformOrigin: "100px 78px" }}
        animate={reduced ? undefined : { y: [0, -2, 0, -1, 0], scale: [1, 1.03, 1, 1.015, 1] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M78 55 h44 a8 8 0 0 1 8 8 v22 a8 8 0 0 1 -8 8 h-18 l-8 8 v-8 h-18 a8 8 0 0 1 -8 -8 v-22 a8 8 0 0 1 8 -8 z" />
        {bubbleDots.map((cx, i) => (
          <motion.circle
            key={cx}
            cx={cx}
            cy={76}
            r={1.8}
            fill="currentColor"
            stroke="none"
            animate={reduced ? undefined : { opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.22 }}
          />
        ))}
      </motion.g>
    </g>
  );
}


function BuildArt({ reduced }: { reduced: boolean }) {
  // Linhas "de código" — animam pathLength em sequência para simular digitação.
  // Editor (topo): linhas azuis restritas ao card cinza.
  // Celular (base): linhas accent-2 dentro da silhueta do celular.
  const codeLines: Array<{ key: string; x1: number; y1: number; x2: number; y2: number; delay: number; accent?: boolean }> = [
    { key: "l1", x1: 94, y1: 70, x2: 150, y2: 70, delay: 0 },
    { key: "l2", x1: 94, y1: 82, x2: 140, y2: 82, delay: 0.55 },
    { key: "l3", x1: 94, y1: 94, x2: 145, y2: 94, delay: 1.1 },
    { key: "l4", x1: 42, y1: 110, x2: 86, y2: 110, delay: 1.65 },
    { key: "l5", x1: 42, y1: 120, x2: 82, y2: 120, delay: 2.2 },
    { key: "l6", x1: 112, y1: 122, x2: 148, y2: 122, delay: 2.9, accent: true },
    { key: "l7", x1: 112, y1: 134, x2: 144, y2: 134, delay: 3.4, accent: true },
    { key: "l8", x1: 112, y1: 146, x2: 140, y2: 146, delay: 3.9, accent: true },
  ];
  const cycle = 6;
  return (
    <g>
      <rect x="30" y="35" width="130" height="95" rx="6" />
      <line x1="30" y1="52" x2="160" y2="52" />
      {[40, 47, 54].map((cx, i) => (
        <motion.circle
          key={cx}
          cx={cx}
          cy={43.5}
          r={1.6}
          fill="currentColor"
          animate={reduced ? undefined : { opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
        />
      ))}
      <rect x="42" y="65" width="42" height="30" rx="3" />
      {/* silhueta de celular */}
      <g className="text-accent-2" stroke="currentColor">
        <rect
          x="105"
          y="100"
          width="50"
          height="80"
          rx="8"
          fill="var(--color-background)"
          stroke="currentColor"
        />
        <line x1="122" y1="108" x2="138" y2="108" />
        <circle cx="130" cy="173" r="2" fill="none" />
      </g>
      {codeLines.map((l) => (
        <motion.line
          key={l.key}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          className={l.accent ? "text-accent-2" : undefined}
          stroke="currentColor"
          initial={reduced ? undefined : { pathLength: 0 }}
          animate={reduced ? undefined : { pathLength: [0, 1, 1, 0] }}
          transition={{
            duration: cycle,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.45, 0.9, 1],
            delay: l.delay,
          }}
        />
      ))}
    </g>
  );
}

function DeliveryArt({ reduced }: { reduced: boolean }) {
  // Gear at the midpoint of the animated arc (~178, 156)
  const gearCx = 178;
  const gearCy = 156;
  const teeth = Array.from({ length: 8 }, (_, i) => (i * 360) / 8);
  return (
    <g>
      <g className="text-accent" stroke="currentColor">
        <motion.path
          d="M100 20 a 80 80 0 1 1 -56 24"
          strokeDasharray="4 5"
          animate={reduced ? undefined : { strokeDashoffset: [0, -36] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
        />
        <circle cx="100" cy="20" r="3" fill="var(--color-background)" />
        <circle cx="44" cy="44" r="3" fill="var(--color-background)" />
      </g>

      {/* engrenagem no meio do arco */}
      <motion.g
        className="text-accent"
        stroke="currentColor"
        style={{ transformOrigin: `${gearCx}px ${gearCy}px` }}
        animate={reduced ? undefined : { rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      >
        <circle cx={gearCx} cy={gearCy} r={9} fill="var(--color-background)" />
        <circle cx={gearCx} cy={gearCy} r={3.2} fill="var(--color-background)" />
        {teeth.map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = gearCx + Math.cos(rad) * 9;
          const y1 = gearCy + Math.sin(rad) * 9;
          const x2 = gearCx + Math.cos(rad) * 12.5;
          const y2 = gearCy + Math.sin(rad) * 12.5;
          return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </motion.g>

      <g className="text-foreground" stroke="currentColor">
        <rect x="55" y="65" width="90" height="70" rx="6" />
        <line x1="55" y1="80" x2="145" y2="80" />
        <circle cx="63" cy="72.5" r="1.4" fill="currentColor" />
        <circle cx="69" cy="72.5" r="1.4" fill="currentColor" />
        <circle cx="75" cy="72.5" r="1.4" fill="currentColor" />
      </g>
      <motion.path
        d="M75 105 l14 14 l26 -30"
        stroke="currentColor"
        strokeWidth={2.5}
        initial={reduced ? undefined : { pathLength: 0 }}
        animate={
          reduced
            ? { color: "var(--color-accent-2)" }
            : {
                pathLength: [0, 1, 1, 0],
                color: [
                  "var(--color-accent-2)",
                  "var(--color-success)",
                  "var(--color-success)",
                  "var(--color-accent-2)",
                ],
              }
        }
        transition={{
          duration: 3.6,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.45, 0.8, 1],
        }}
      />
    </g>
  );
}
