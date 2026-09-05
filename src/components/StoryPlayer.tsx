import { useEffect, useRef, useState } from "react";
import { stories, type Scene } from "../data/stories";
import Scenes from "./Scenes";
const reviewScene: Scene = {
  title: "Hold for human review",
  caption:
    "This job stops on the review path. Resolve the missing required information or unsupported city route before preparing a handoff. No UiPath execution is implied.",
  duration: 9000,
};
export function sequenceFor(kind: string, branch: string) {
  const main = stories[kind];
  if (!main) throw Error(`Unknown story: ${kind}`);
  if (kind === "ipermit" && branch !== "complete")
    return [
      {
        scene: {
          ...main.scenes[0],
          caption:
            branch === "missing"
              ? "A fictional Zoho job enters intake with a required contractor field missing."
              : "A fictional job requests a city outside the supported pilot route.",
        },
        visual: 0,
      },
      {
        scene:
          branch === "missing"
            ? {
                ...main.scenes[2],
                caption:
                  "Validation detects a missing contractor field. The record needs review before city preparation.",
              }
            : {
                ...main.scenes[3],
                caption:
                  "The requested city is unsupported or inactive. The parent workflow selects its review branch.",
              },
        visual: branch === "missing" ? 2 : 3,
      },
      { scene: reviewScene, visual: 5 },
    ];
  return main.scenes.map((scene, i) => ({ scene, visual: i }));
}
export default function StoryPlayer({ kind }: { kind: string }) {
  const [step, setStep] = useState(0),
    [playing, setPlaying] = useState(true),
    [visible, setVisible] = useState(false),
    [tabVisible, setTabVisible] = useState(true),
    [reduced, setReduced] = useState(true),
    [elapsed, setElapsed] = useState(0),
    [branch, setBranch] = useState("complete");
  const root = useRef<HTMLDivElement>(null);
  const sequence = sequenceFor(kind, branch),
    current = sequence[Math.min(step, sequence.length - 1)],
    count = sequence.length;
  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const motion = () => {
      setReduced(mq.matches);
      if (mq.matches) setPlaying(false);
    };
    motion();
    mq.addEventListener("change", motion);
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.15 },
    );
    if (root.current) observer.observe(root.current);
    const visibility = () => setTabVisible(!document.hidden);
    visibility();
    document.addEventListener("visibilitychange", visibility);
    return () => {
      mq.removeEventListener("change", motion);
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  const running = playing && visible && tabVisible && !reduced;
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setElapsed((v) => v + 100), 100);
    return () => clearInterval(timer);
  }, [running]);
  useEffect(() => {
    if (elapsed < current.scene.duration) return;
    if (step === count - 1) {
      setPlaying(false);
      setElapsed(current.scene.duration);
    } else {
      setStep((s) => s + 1);
      setElapsed(0);
    }
  }, [elapsed, step, count, current.scene.duration]);
  function go(n: number) {
    setStep(Math.max(0, Math.min(count - 1, n)));
    setElapsed(0);
    setPlaying(false);
  }
  return (
    <div
      ref={root}
      className={`story-player ${running ? "is-running" : "is-paused"} ${reduced ? "reduced-motion" : ""}`}
      data-running={running}
      data-scene={step}
      data-elapsed={elapsed}
      id="walkthrough"
    >
      <div className="player-topline">
        <span>{stories[kind].label}</span>
        <span>
          ~
          {Math.round(
            sequence.reduce((t, s) => t + s.scene.duration, 0) / 1000,
          )}{" "}
          seconds · silent
        </span>
      </div>
      {kind === "ipermit" && (
        <div className="branch-selector">
          <span>Explore a path</span>
          {[
            ["complete", "Complete job"],
            ["missing", "Missing field"],
            ["unsupported", "Unsupported city"],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => {
                setBranch(value);
                setStep(0);
                setElapsed(0);
                setPlaying(false);
              }}
              aria-pressed={branch === value}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      <div className="player-body">
        <div className="player-visual">
          <Scenes
            kind={stories[kind].renderer}
            step={current.visual}
            branch={branch}
            scene={current.scene}
          />
        </div>
        <nav className="scene-nav" aria-label="Story scenes">
          <span className="eyebrow">THE STORY</span>
          {sequence.map(({ scene }, i) => (
            <button
              key={scene.title}
              onClick={() => go(i)}
              aria-current={step === i ? "step" : undefined}
            >
              <span>{String(i + 1).padStart(2, "0")}</span>
              {scene.title}
            </button>
          ))}
        </nav>
      </div>
      <div
        className="player-progress"
        role="progressbar"
        aria-label="Story progress"
        aria-valuemin={0}
        aria-valuemax={count}
        aria-valuenow={step + elapsed / current.scene.duration}
      >
        <span
          style={{
            width: `${((step + elapsed / current.scene.duration) / count) * 100}%`,
          }}
        />
      </div>
      <div className="player-bottom">
        <div className="player-controls">
          <button
            aria-label={playing && !reduced ? "Pause story" : "Play story"}
            onClick={() => {
              if (reduced) return;
              if (elapsed >= current.scene.duration) {
                setStep(0);
                setElapsed(0);
              }
              setPlaying(!playing);
            }}
            disabled={reduced}
          >
            {playing && !reduced ? "Ⅱ" : "▶"}
          </button>
          <button
            aria-label="Previous scene"
            onClick={() => go(step - 1)}
            disabled={step === 0}
          >
            ←
          </button>
          <button
            aria-label="Next scene"
            onClick={() => go(step + 1)}
            disabled={step === count - 1}
          >
            →
          </button>
          <button
            aria-label="Replay story"
            onClick={() => {
              setStep(0);
              setElapsed(0);
              setPlaying(!reduced);
            }}
          >
            ↺
          </button>
          <span>
            {String(step + 1).padStart(2, "0")} /{" "}
            {String(count).padStart(2, "0")}
          </span>
        </div>
        <div className="scene-caption" aria-live={running ? "off" : "polite"}>
          <strong>{current.scene.title}</strong>
          <p>{current.scene.caption}</p>
        </div>
      </div>
      {reduced && (
        <p className="motion-note">
          Reduced motion is on. Use the scene controls to explore the complete
          story at your own pace.
        </p>
      )}
      <details className="story-transcript">
        <summary>Read the complete step-by-step story</summary>
        <ol>
          {sequence.map(({ scene }) => (
            <li key={scene.title}>
              <strong>{scene.title}</strong>
              <p>{scene.caption}</p>
            </li>
          ))}
        </ol>
      </details>
    </div>
  );
}
