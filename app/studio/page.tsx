"use client";

import { useMemo, useState } from "react";

const stages = ["Design", "Throw", "Trim", "Bisque", "Glaze"] as const;
type Stage = (typeof stages)[number];

type StageDetail = {
  available: boolean;
  headline: string;
  note: string;
};

type Piece = {
  id: string;
  title: string;
  description: string;
  year: string;
  quantity: string;
  materials?: string;
  stageDetails: Partial<Record<Stage, StageDetail>>;
};

const pieces: Piece[] = [
  {
    id: "housewarming-mugs",
    title: "Housewarming Mug Set",
    description:
      "A set of mugs designed as a housewarming gift for my first close friend to buy her own flat in London.",
    year: "2025",
    quantity: "Set of 6",
    materials: "Tenmoku and raw stoneware exterior, Cornish white interior",
    stageDetails: {
      Design: {
        available: true,
        headline: "Profile sketches and handle tests",
        note: "Wheel-thrown proportions drafted to stack cleanly and pour comfortably.",
      },
      Throw: {
        available: true,
        headline: "Bodies thrown in one Sunday run",
        note: "Six forms pulled from the same clay body to keep wall thickness consistent.",
      },
      Trim: {
        available: false,
        headline: "Trim notes pending",
        note: "Stage photos coming soon.",
      },
      Bisque: {
        available: true,
        headline: "Bisque-fired and checked for balance",
        note: "Handles and rims inspected before glaze testing.",
      },
      Glaze: {
        available: true,
        headline: "Final tenmoku and white finish",
        note: "The contrast between matte exterior and bright interior carries the set.",
      },
    },
  },
  {
    id: "donut-vase",
    title: "Donut Vase",
    description:
      "Donut vase, set as a technical challenge by my winter pottery instructor. Shown with custom wooden base by Tom Lister.",
    year: "2023",
    quantity: "1",
    materials: "Stoneware and custom wooden base",
    stageDetails: {
      Design: {
        available: true,
        headline: "Cross-section planning",
        note: "The challenge was preserving a clean opening while keeping the ring shape stable.",
      },
      Throw: {
        available: true,
        headline: "Composite throw and join",
        note: "Built from separate forms that were merged while leather-hard.",
      },
      Trim: {
        available: true,
        headline: "Refining the inner arc",
        note: "The inner edge was trimmed back to keep a sharp silhouette.",
      },
      Bisque: {
        available: false,
        headline: "Bisque archive missing",
        note: "In progress: digitizing old studio photos.",
      },
      Glaze: {
        available: true,
        headline: "Final finish with timber base",
        note: "Mounted on a custom stand to stabilize and frame the form.",
      },
    },
  },
  {
    id: "small-bowl",
    title: "Small Bowl",
    description: "Small bowl study from repeat throwing sessions.",
    year: "2024",
    quantity: "1",
    stageDetails: {
      Design: {
        available: false,
        headline: "Sketches not yet uploaded",
        note: "Coming soon.",
      },
      Throw: {
        available: true,
        headline: "Quick throw, narrow foot",
        note: "A low-profile bowl used to test lip tension and volume.",
      },
      Trim: {
        available: true,
        headline: "Foot ring refinement",
        note: "Trim pass to lighten base weight and sharpen outline.",
      },
      Bisque: {
        available: false,
        headline: "Bisque documentation pending",
        note: "Coming soon.",
      },
      Glaze: {
        available: false,
        headline: "Glaze tests pending",
        note: "Coming soon.",
      },
    },
  },
];

export default function StudioPage() {
  const [activeStage, setActiveStage] = useState<Stage>("Design");

  const stageIndex = useMemo(() => stages.findIndex((stage) => stage === activeStage), [activeStage]);

  return (
    <main className="page-shell">
      <p className="section-kicker" style={{ color: "var(--olive)" }}>
        Make / Ceramics
      </p>
      <h1 className="section-title" style={{ color: "var(--olive)" }}>
        At the studio
      </h1>
      <p className="section-intro">
        A rotating process view of recent pieces. Slide through each stage to trace what changes between intent, form, and finish.
      </p>

      <div className="process-slider" role="tablist" aria-label="Ceramic process stages">
        {stages.map((stage, index) => (
          <button
            key={stage}
            type="button"
            className={`process-step clickable ${stage === activeStage ? "active" : ""}`}
            onClick={() => setActiveStage(stage)}
            aria-selected={stage === activeStage}
            role="tab"
            style={{
              transform: stage === activeStage ? "translateY(-2px)" : "none",
              transitionDelay: `${index * 25}ms`,
            }}
          >
            {stage}
          </button>
        ))}
      </div>

      <hr className="rule" style={{ background: "linear-gradient(to right, transparent, rgba(211, 64, 22, 0.65), transparent)" }} />

      <section className="section-grid" style={{ gap: "1rem" }}>
        {pieces.map((piece) => {
          const detail = piece.stageDetails[activeStage];
          const available = detail?.available ?? false;
          return (
            <article className="info-card" key={piece.id}>
              <h3>{piece.title}</h3>
              <p style={{ fontStyle: "italic" }}>{piece.description}</p>
              <p className="smallcaps" style={{ marginTop: "0.55rem", fontFamily: "var(--font-sans)", fontSize: "0.82rem" }}>
                {piece.year} | Qty: {piece.quantity}
              </p>
              {piece.materials ? (
                <p style={{ marginTop: "0.35rem", fontFamily: "var(--font-sans)", fontSize: "0.83rem", opacity: 0.82 }}>
                  {piece.materials}
                </p>
              ) : null}

              <div className="stage-panel" key={`${piece.id}-${stageIndex}`}>
                {available ? (
                  <div>
                    <h4>{detail?.headline}</h4>
                    <p>{detail?.note}</p>
                  </div>
                ) : (
                  <div className="stage-placeholder">
                    <h4>
                      Hourglass stage: {activeStage}
                    </h4>
                    <p>{detail?.note ?? "In progress."}</p>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </section>

      <p className="section-footer">Design -&gt; Throw -&gt; Trim -&gt; Bisque -&gt; Glaze</p>
    </main>
  );
}
