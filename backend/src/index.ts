import { serve } from "@hono/node-server";
import { Hono } from "hono";
import ical from "ical-generator";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/api/events/calendar.ics", async (c) => {
  const events = [
    {
      id: 1,
      title: "Lumos勉強会",
      description: "TypeScriptの勉強会です",
      start: "2026-11-20T18:00:00+09:00",
      end: "2026-11-20T20:00:00+09:00",
      location: "横浜国立大学",
    },
    {
      id: 2,
      title: "ハッカソン",
      description: "チーム開発イベント",
      start: "2026-11-25T10:00:00+09:00",
      end: "2026-11-25T18:00:00+09:00",
      location: "オンライン",
    },
  ];

  // カレンダーを生成
  const calendar = ical({
    name: "Lumos Events",
  });

  // イベントを追加
  for (const event of events) {
    calendar.createEvent({
      id: `event-${event.id}@lumos-ynu.jp`,
      start: new Date(event.start),
      end: new Date(event.end),
      summary: event.title,
      description: event.description,
      location: event.location,
    });
  }

  // ICS形式で返す
  return c.body(calendar.toString(), 200, {
    "Content-Type": "text/calendar; charset=utf-8",
  });
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
