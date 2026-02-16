"use client";

import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";

// ============================================
// EXISTING PAGES - only these get clickable links
// ============================================
const existingPages = new Set(["/galleries", "/reading", "/work"]);

type EventColor = "blue" | "red" | "olive" | "gold";

type CalendarEvent = {
  id: string;
  day: number;
  title: string;
  time: string;
  start: number;
  end: number;
  href?: string;
  color: EventColor;
  primary: boolean;
  statusDay: string;
  statusActivity: string;
};

type StatusLine = {
  day: string;
  activity: string;
  color: EventColor;
};

const dayLabels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const dayShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const timelineStart = 8;
const timelineEnd = 21;
const timelineMarks = [8, 10, 12, 14, 16, 18, 20];

// Pale = resting state, full = hovered state
const colorTones: Record<
  EventColor,
  {
    pale: string;
    full: string;
    accent: string;
  }
> = {
  blue: {
    pale: "rgba(33, 89, 255, 0.12)",
    full: "rgba(33, 89, 255, 0.7)",
    accent: "var(--blue)",
  },
  red: {
    pale: "rgba(211, 64, 22, 0.12)",
    full: "rgba(211, 64, 22, 0.7)",
    accent: "var(--red)",
  },
  olive: {
    pale: "rgba(165, 157, 50, 0.14)",
    full: "rgba(165, 157, 50, 0.7)",
    accent: "var(--olive)",
  },
  gold: {
    pale: "rgba(246, 191, 39, 0.16)",
    full: "rgba(246, 191, 39, 0.7)",
    accent: "var(--gold)",
  },
};

const calendarEvents: CalendarEvent[] = [
  {
    id: "sun-ceramics",
    day: 0,
    title: "Ceramics",
    time: "9:30-12:30",
    start: 9.5,
    end: 12.5,
    href: "/studio",
    color: "olive",
    primary: true,
    statusDay: "Sunday afternoon",
    statusActivity: "at the studio",
  },
  {
    id: "sun-flight",
    day: 0,
    title: "Flight to...",
    time: "4:00-7:00",
    start: 16,
    end: 19,
    color: "red",
    primary: false,
    statusDay: "Sunday evening",
    statusActivity: "in transit",
  },
  {
    id: "mon-commute",
    day: 1,
    title: "Commute",
    time: "8:00-9:00",
    start: 8,
    end: 8.75,
    href: "/reading",
    color: "gold",
    primary: true,
    statusDay: "Monday morning",
    statusActivity: "reading on the tube",
  },
  {
    id: "mon-work-am",
    day: 1,
    title: "Work",
    time: "9:00-12:30",
    start: 9,
    end: 12.5,
    href: "/work",
    color: "blue",
    primary: true,
    statusDay: "Monday",
    statusActivity: "at the office",
  },
  {
    id: "mon-work-pm",
    day: 1,
    title: "Work",
    time: "1:30-9:00",
    start: 13.5,
    end: 21,
    href: "/work",
    color: "blue",
    primary: false,
    statusDay: "Monday",
    statusActivity: "at the office",
  },
  {
    id: "tue-commute",
    day: 2,
    title: "Commute",
    time: "8:00-9:00",
    start: 8,
    end: 8.75,
    href: "/reading",
    color: "gold",
    primary: false,
    statusDay: "Tuesday morning",
    statusActivity: "reading on the tube",
  },
  {
    id: "tue-work-am",
    day: 2,
    title: "Work",
    time: "9:00-12:30",
    start: 9,
    end: 12.5,
    href: "/work",
    color: "blue",
    primary: false,
    statusDay: "Tuesday",
    statusActivity: "at the office",
  },
  {
    id: "tue-work-pm",
    day: 2,
    title: "Work",
    time: "1:30-6:00",
    start: 13.5,
    end: 18,
    href: "/work",
    color: "blue",
    primary: false,
    statusDay: "Tuesday",
    statusActivity: "at the office",
  },
  {
    id: "wed-commute",
    day: 3,
    title: "Commute",
    time: "8:00-9:00",
    start: 8,
    end: 8.75,
    href: "/reading",
    color: "gold",
    primary: false,
    statusDay: "Wednesday morning",
    statusActivity: "reading on the tube",
  },
  {
    id: "wed-work-am",
    day: 3,
    title: "Work",
    time: "9:00-12:30",
    start: 9,
    end: 12.5,
    href: "/work",
    color: "blue",
    primary: false,
    statusDay: "Wednesday",
    statusActivity: "at the office",
  },
  {
    id: "wed-work-pm",
    day: 3,
    title: "Work",
    time: "1:30-9:00",
    start: 13.5,
    end: 21,
    href: "/work",
    color: "blue",
    primary: false,
    statusDay: "Wednesday",
    statusActivity: "at the office",
  },
  {
    id: "thu-commute",
    day: 4,
    title: "Commute",
    time: "8:00-9:00",
    start: 8,
    end: 8.75,
    href: "/reading",
    color: "gold",
    primary: false,
    statusDay: "Thursday morning",
    statusActivity: "reading on the tube",
  },
  {
    id: "thu-work-am",
    day: 4,
    title: "Work",
    time: "9:00-12:30",
    start: 9,
    end: 12.5,
    href: "/work",
    color: "blue",
    primary: false,
    statusDay: "Thursday",
    statusActivity: "at the office",
  },
  {
    id: "thu-work-pm",
    day: 4,
    title: "Work",
    time: "1:30-3:00",
    start: 13.5,
    end: 15,
    href: "/work",
    color: "blue",
    primary: false,
    statusDay: "Thursday",
    statusActivity: "at the office",
  },
  {
    id: "thu-board",
    day: 4,
    title: "Board Meeting",
    time: "3:00-7:00",
    start: 15,
    end: 19,
    href: "/board-meeting",
    color: "red",
    primary: true,
    statusDay: "Thursday afternoon",
    statusActivity: "in a board meeting",
  },
  {
    id: "fri-commute",
    day: 5,
    title: "Commute",
    time: "8:00-9:00",
    start: 8,
    end: 8.75,
    href: "/reading",
    color: "gold",
    primary: false,
    statusDay: "Friday morning",
    statusActivity: "reading on the tube",
  },
  {
    id: "fri-work-am",
    day: 5,
    title: "Work",
    time: "9:00-12:30",
    start: 9,
    end: 12.5,
    href: "/work",
    color: "blue",
    primary: false,
    statusDay: "Friday",
    statusActivity: "at the office",
  },
  {
    id: "fri-work-pm",
    day: 5,
    title: "Work",
    time: "1:30-6:00",
    start: 13.5,
    end: 18,
    href: "/work",
    color: "blue",
    primary: false,
    statusDay: "Friday",
    statusActivity: "at the office",
  },
  {
    id: "fri-dinner",
    day: 5,
    title: "Dinner",
    time: "6:30-7:30",
    start: 18.5,
    end: 19.5,
    href: "/dinner",
    color: "red",
    primary: false,
    statusDay: "Friday night",
    statusActivity: "out to dinner in London",
  },
  {
    id: "sat-read",
    day: 6,
    title: "Read",
    time: "8:30-10:30",
    start: 8.5,
    end: 10.5,
    href: "/reading",
    color: "gold",
    primary: false,
    statusDay: "Saturday morning",
    statusActivity: "reading",
  },
  {
    id: "sat-gallery",
    day: 6,
    title: "Gallery",
    time: "11:00-2:00",
    start: 11,
    end: 14,
    href: "/galleries",
    color: "olive",
    primary: true,
    statusDay: "Saturday afternoon",
    statusActivity: "at the gallery",
  },
  {
    id: "sat-dinner",
    day: 6,
    title: "Dinner",
    time: "7:00-9:00",
    start: 19,
    end: 21,
    href: "/dinner",
    color: "red",
    primary: true,
    statusDay: "Saturday night",
    statusActivity: "out to dinner in London",
  },
];

function getDefaultStatus(now: Date): StatusLine {
  const day = now.getDay();
  const hour = now.getHours() + now.getMinutes() / 60;

  if (day === 2 && hour >= 19 && hour <= 21) {
    return { day: "Tuesday evening", activity: "taking me time", color: "olive" };
  }

  if (day === 0 && hour < 12) {
    return { day: "Sunday morning", activity: "sitting down with the newspaper", color: "gold" };
  }

  if (day === 0 && hour >= 12 && hour < 16) {
    return { day: "Sunday morning", activity: "at the studio", color: "olive" };
  }

  if (day === 4 && hour >= 15 && hour < 19) {
    return { day: "Thursday afternoon", activity: "in a board meeting", color: "red" };
  }

  if (day === 4 && hour >= 19) {
    return { day: "Thursday evening", activity: "writing", color: "red" };
  }

  if (day >= 1 && day <= 5 && hour >= 9 && hour < 18) {
    return { day: dayLabels[day], activity: "at the office", color: "blue" };
  }

  if (day === 6 && hour >= 11 && hour < 16) {
    return { day: "Saturday afternoon", activity: "at the gallery", color: "olive" };
  }

  if (day === 6 && hour >= 16) {
    return { day: "Saturday night", activity: "out to dinner in London", color: "red" };
  }

  return { day: "this week", activity: "moving through the city", color: "blue" };
}

function toTopPercent(start: number): number {
  return ((start - timelineStart) / (timelineEnd - timelineStart)) * 100;
}

function toHeightPercent(start: number, end: number): number {
  return ((end - start) / (timelineEnd - timelineStart)) * 100;
}

export default function Home() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const [mobileDay, setMobileDay] = useState(new Date().getDay());

  const hoveredEvent = useMemo(
    () => calendarEvents.find((event) => event.id === hoveredId) ?? null,
    [hoveredId],
  );

  const status = hoveredEvent
    ? { day: hoveredEvent.statusDay, activity: hoveredEvent.statusActivity, color: hoveredEvent.color }
    : getDefaultStatus(new Date());

  const eventsByDay = useMemo(
    () => dayLabels.map((_, dayIndex) => calendarEvents.filter((event) => event.day === dayIndex)),
    [],
  );

  const statusStyle = { "--status-color": colorTones[status.color].accent } as CSSProperties;

  const getCardStyle = (event: CalendarEvent): CSSProperties => {
    const tones = colorTones[event.color];
    const isDirectHover = hoveredId === event.id;
    const isGroupHover = hoveredHref != null && event.href === hoveredHref;
    const isHighlighted = isDirectHover || isGroupHover;
    return {
      backgroundColor: isHighlighted ? tones.full : tones.pale,
      borderColor: "rgba(85, 49, 26, 0.18)",
      transition: "background-color 0.2s ease",
    };
  };

  const renderEventCard = (event: CalendarEvent, style: CSSProperties) => {
    const content = (
      <>
        <span className="calendar-card-title">{event.title}</span>
        <span className="calendar-card-time">{event.time}</span>
      </>
    );

    const hasLink = event.href && existingPages.has(event.href);

    if (!hasLink) {
      return (
        <div
          key={event.id}
          className="calendar-card"
          style={style}
          onMouseEnter={() => { setHoveredId(event.id); setHoveredHref(event.href || null); }}
          onMouseLeave={() => { setHoveredId(null); setHoveredHref(null); }}
        >
          {content}
        </div>
      );
    }

    return (
      <Link
        key={event.id}
        href={event.href!}
        className="calendar-card"
        style={style}
        onMouseEnter={() => { setHoveredId(event.id); setHoveredHref(event.href || null); }}
        onMouseLeave={() => { setHoveredId(null); setHoveredHref(null); }}
      >
        {content}
      </Link>
    );
  };

  return (
    <main className="home-shell" style={statusStyle}>
      <h1 className="status-line">
        It&apos;s <span className="status-accent">{status.day}</span> and Miriam is <span className="status-accent">{status.activity}</span>
      </h1>

      <section className="calendar-grid-wrap" aria-label="Weekly calendar">
        <div className="calendar-grid">
          {dayLabels.map((day, dayIndex) => (
            <article key={day} className="day-column">
              <h2 className="day-label">{day}</h2>
              <div className="day-events">
                {timelineMarks.map((mark) => (
                  <div key={`${day}-${mark}`} className="day-track-line" style={{ top: `${toTopPercent(mark)}%` }} />
                ))}

                {eventsByDay[dayIndex].map((event) => {
                  const top = toTopPercent(event.start);
                  const height = toHeightPercent(event.start, event.end);
                  const eventStyle: CSSProperties = {
                    ...getCardStyle(event),
                    top: `calc(${top}% + 2px)`,
                    height: `calc(${height}% - 4px)`,
                  };

                  return renderEventCard(event, eventStyle);
                })}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mobile-day-toggle" aria-label="Mobile day view">
        <div className="mobile-day-chips">
          {dayShort.map((day, index) => (
            <button
              type="button"
              key={day}
              className={`mobile-day-chip clickable ${mobileDay === index ? "active" : ""}`}
              onClick={() => setMobileDay(index)}
            >
              {day}
            </button>
          ))}
        </div>

        <div className="mobile-event-stack">
          {eventsByDay[mobileDay].map((event) => {
            const style: CSSProperties = {
              ...getCardStyle(event),
              minHeight: `${Math.max(42, (event.end - event.start) * 24)}px`,
            };

            return renderEventCard(event, style);
          })}
        </div>
      </section>

      <footer className="text-center py-8 text-sm" style={{ color: 'var(--brown)' }}>
        © 2026 Miriam Ames Feldman
      </footer>
    </main>
  );
}
