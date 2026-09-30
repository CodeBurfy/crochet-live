import { useState, useEffect } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock,
  Coffee,
  Gift,
  Heart,
  Instagram,
  Lock,
  MapPin,
  MessageCircle,
  Scissors,
  Sparkles,
  Users,
} from "lucide-react";
import { AdminPage } from "./AdminPage";
import { supabase } from "./supabaseClient";

/* ------------------------------------------------------------------ */
/*  ★ EDIT ME — your links & class dates live here                     */
/* ------------------------------------------------------------------ */
const INSTAGRAM_URL = "https://www.instagram.com/muglee_mugs";
// Swap this with your booking form (Tally / Google Form / Eventbrite) when ready.
// Until then it opens an Instagram DM so people can book in one tap.
const BOOKING_URL = "https://ig.me/m/muglee_mugs";

const WORKSHOPS = [];

/* ------------------------------------------------------------------ */

const FAQS = [
  {
    q: "I've never crocheted before. Is this for me?",
    a: "Yes — that's exactly who it's for. Most students pick up their hook for the first time at the workshop. We start from zero: how to hold the yarn, the first stitches, all of it, at a relaxed pace.",
  },
  {
    q: "Do I need to bring anything?",
    a: "Nope. All materials are included — yarn, hooks, and everything you need. Just bring yourself (and maybe a friend). Your drink is on you, the crochet is on us.",
  },
  {
    q: "Where in Ellicott City are the workshops held?",
    a: "We partner with cozy local cafés in Ellicott City, MD. The exact venue for each date is confirmed on Instagram @muglee_mugs a few days before — follow along so you don't miss it.",
  },
  {
    q: "What will I actually make?",
    a: "In 2 hours you'll learn the core stitches and finish a small starter project you take home — plus the skills to keep going on your own.",
  },
  {
    q: "What if I need to cancel?",
    a: "Life happens. Message us on Instagram at least 48 hours ahead and we'll move you to the next workshop, no stress.",
  },
  {
    q: "Do you do private or group events?",
    a: "Yes! Birthdays, bridal showers, team offsites, kids' parties — a Sip & Crochet session is a great group activity. DM @muglee_mugs to plan one.",
  },
];

function SectionHeading({ eyebrow, title, sub }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-clay">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
        {title}
      </h2>
      {sub && <p className="mt-3 text-ink-soft">{sub}</p>}
    </div>
  );
}

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/10 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-clay text-cream">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="font-display text-xl font-semibold">
            muglee<span className="text-clay">·</span>mugs
          </span>
        </a>
        <nav className="hidden items-center gap-6 text-sm font-medium text-ink-soft md:flex">
          <a href="#classes" className="hover:text-ink">Classes</a>
          <a href="#learn" className="hover:text-ink">What you'll learn</a>
          <a href="#faq" className="hover:text-ink">FAQ</a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-ink"
          >
            <Instagram className="h-4 w-4" /> @muglee_mugs
          </a>
        </nav>
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-clay"
        >
          Book a spot
        </a>
      </div>
    </header>
  );
}

function Hero({ price, duration }) {
  return (
    <section id="top" className="relative overflow-hidden pt-28 sm:pt-32">
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blush blur-3xl" />
      <div className="pointer-events-none absolute -left-32 top-64 h-80 w-80 rounded-full bg-blush/60 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 sm:px-6 lg:grid-cols-2 lg:pb-24">
        <div>
          <p className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-white/60 px-3.5 py-1.5 text-xs font-semibold text-ink-soft">
            <MapPin className="h-3.5 w-3.5 text-clay" /> Ellicott City, MD
          </p>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-6xl">
            Sip, stitch &amp; learn crochet in one{" "}
            <span className="italic text-clay">cozy</span> afternoon.
          </h1>
          <p className="mt-5 max-w-lg text-lg text-ink-soft">
            A {duration?.toLowerCase()} beginner-friendly Sip &amp; Crochet
            workshop. All materials included, zero experience needed — leave
            with a handmade piece and a brand-new hobby.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-clay px-7 py-3.5 font-semibold text-cream shadow-lg shadow-clay/30 transition hover:bg-clay-dark"
            >
              Book your spot <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#how"
              className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-7 py-3.5 font-semibold text-ink transition hover:border-ink"
            >
              See how it works
            </a>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-ink-soft">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-clay" /> {duration}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Coffee className="h-4 w-4 text-clay" /> Sip &amp; crochet vibe
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-4 w-4 text-clay" /> Materials included
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-4 w-4 text-clay" /> Beginners welcome
            </span>
          </div>
        </div>
        <div className="relative">
          <div className="overflow-hidden rounded-[2rem] shadow-2xl shadow-ink/20">
            <img
              src="hero.jpg"
              alt="Hands crocheting with pink yarn beside a latte at a cozy workshop table"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          {WORKSHOPS.length > 0 && (
            <div className="absolute -bottom-5 -left-4 flex items-center gap-3 rounded-2xl border border-ink/10 bg-white px-4 py-3 shadow-xl sm:-left-8">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sage/15 text-sage">
                <CalendarDays className="h-5 w-5" />
              </span>
              <div className="text-sm">
                <p className="font-bold">Next workshop: {WORKSHOPS[0].date}</p>
                <p className="text-ink-soft">
                  {WORKSHOPS[0].spotsLeft} spots left · ${PRICE}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function StatsStrip({ duration }) {
  const stats = [
    { big: duration, small: "hands-on, no rushing" },
    { big: "Zero", small: "experience needed" },
    { big: "100%", small: "beginner-friendly" },
    { big: "All", small: "materials included" },
  ];
  return (
    <section className="border-y border-ink/10 bg-parchment/60">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.small} className="text-center">
            <p className="font-display text-3xl font-semibold text-clay">
              {s.big}
            </p>
            <p className="mt-1 text-sm text-ink-soft">{s.small}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Workshops() {
  return (
    <section id="classes" className="scroll-mt-20 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Upcoming workshops"
          title="Pick a date, grab a latte, learn to crochet"
          sub="Small groups, relaxed pace, everything provided. New dates drop on Instagram first."
        />
        {WORKSHOPS.length > 0 ? (
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {WORKSHOPS.map((w) => (
              <div
                key={w.date}
                className="flex flex-col rounded-3xl border border-ink/10 bg-white p-8 shadow-sm transition hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-display text-2xl font-semibold">{w.date}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-soft">
                      <Clock className="h-4 w-4" /> {w.time}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-soft">
                      <MapPin className="h-4 w-4" /> {w.venue}
                    </p>
                  </div>
                  <span className="rounded-full bg-sage/15 px-3 py-1 text-xs font-bold text-sage">
                    {w.spotsLeft} spots left
                  </span>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-6">
                  <p className="font-display text-3xl font-semibold">
                    ${PRICE}
                    <span className="ml-1 align-middle font-body text-sm font-normal text-ink-soft">
                      / person
                    </span>
                  </p>
                  <a
                    href={BOOKING_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream transition hover:bg-clay"
                  >
                    Book <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-3xl border-2 border-dashed border-ink/20 bg-white/50 p-12 text-center">
            <p className="font-display text-xl font-semibold text-ink">Dates coming soon</p>
            <p className="mt-2 text-ink-soft">Follow us on Instagram for the latest workshop announcements.</p>
          </div>
        )}
        <p className="mt-6 text-center text-sm text-ink-soft">
          None of these work?{" "}
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-clay underline underline-offset-2"
          >
            Follow @muglee_mugs
          </a>{" "}
          — new dates are announced there first.
        </p>
      </div>
    </section>
  );
}

function Learn() {
  const cards = [
    {
      icon: Scissors,
      title: "Core stitches, demystified",
      text: "Chain, single and double crochet — the foundation of everything, taught step by step.",
    },
    {
      icon: Gift,
      title: "A handmade piece to take home",
      text: "You won't leave with homework. You'll leave with something you made with your own hands.",
    },
    {
      icon: Coffee,
      title: "The full sip & crochet experience",
      text: "Good drinks, good company, zero pressure. It's a craft class that feels like a hangout.",
    },
    {
      icon: Users,
      title: "Crochet buddies",
      text: "Small groups of fellow beginners. Many students come solo and leave with new friends.",
    },
  ];
  return (
    <section id="learn" className="scroll-mt-20 bg-parchment/60 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="What you'll take home"
          title="More than just a new skill"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <div
              key={c.title}
              className="rounded-3xl border border-ink/10 bg-cream p-7"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-clay/12 text-clay">
                <c.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">
                {c.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {c.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "1",
      title: "Book your spot",
      text: "Pick a date above and book in under a minute. You'll get all the details by DM.",
    },
    {
      n: "2",
      title: "Show up & sip",
      text: "Come as you are — we bring the yarn, hooks, and patterns. You bring the cozy energy.",
    },
    {
      n: "3",
      title: "Leave crocheting",
      text: "Two hours later you walk out with a handmade piece and the confidence to keep going.",
    },
  ];
  return (
    <section id="how" className="scroll-mt-20 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow="How it works" title="Easy as 1-2-3" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="relative rounded-3xl bg-ink p-8 text-cream">
              <p className="font-display text-5xl font-semibold text-clay">
                {s.n}
              </p>
              <h3 className="mt-3 font-display text-xl font-semibold">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-cream/70">
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadGalleryImages();
  }, []);

  const loadGalleryImages = async () => {
    try {
      console.log("🔍 Loading gallery images...");
      console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);

      const { data, error: fetchError } = await supabase
        .from("galleries")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        console.error("❌ Supabase error:", fetchError);
        throw fetchError;
      }

      console.log("✅ Loaded images:", data);
      setImages(data || []);
    } catch (err) {
      console.error("❌ Error loading gallery:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pb-20 sm:pb-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="From the workshops"
          title="Real students, real first stitches"
        />
        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {error && (
            <p className="col-span-full text-center text-red-600">
              Error loading images: {error}
            </p>
          )}
          {loading ? (
            <p className="col-span-full text-center text-ink-soft">Loading...</p>
          ) : images.length > 0 ? (
            images.map((img) => (
              <div
                key={img.id}
                className="overflow-hidden rounded-3xl shadow-md"
              >
                <img
                  src={img.image_url}
                  alt={img.title}
                  className="w-full h-64 object-cover hover:scale-105 transition duration-300"
                />
              </div>
            ))
          ) : (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex aspect-square flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-ink/20 bg-white/50 p-4 text-center"
                >
                  <Heart className="h-6 w-6 text-clay/50" />
                  <p className="text-xs font-medium text-ink-soft">
                    Add workshop photos in admin
                  </p>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
}


function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="scroll-mt-20 py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading eyebrow="FAQ" title="Questions? Answered." />
        <div className="mt-12 space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.q}
                className="overflow-hidden rounded-2xl border border-ink/10 bg-white"
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-semibold">{f.q}</span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg transition ${
                      isOpen ? "bg-clay text-cream" : "bg-ink/5"
                    }`}
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <p className="px-6 pb-6 text-sm leading-relaxed text-ink-soft">
                    {f.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="scroll-mt-20 pb-20 sm:pb-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-clay">
            Your host
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
            Hi, I'm Mugdha 👋
          </h2>
          <p className="mt-4 leading-relaxed text-ink-soft">
            Software developer by day, crochet artist always. What started as my
            own cozy hobby turned into{" "}
            <span className="font-semibold text-ink">@muglee_mugs</span> — and
            now into beginner workshops here in Ellicott City, because the best
            way to learn crochet is with good company, a warm drink, and
            someone patient showing you the ropes.
          </p>
          <p className="mt-3 leading-relaxed text-ink-soft">
            My classes are built for total beginners: small groups, zero
            judgment, and you leave with something you made yourself.
          </p>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3 text-sm font-semibold transition hover:border-ink"
          >
            <Instagram className="h-4 w-4" /> Follow the journey
          </a>
        </div>
        <div className="lg:col-span-2">
          <div className="rounded-[2rem] bg-blush p-8">
            <Sparkles className="h-8 w-8 text-clay" />
            <p className="mt-4 font-display text-xl italic leading-relaxed">
              "Everyone can learn crochet — they just need the right first
              afternoon."
            </p>
            <p className="mt-4 text-sm font-semibold">— Mugdha</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCta({ duration }) {
  return (
    <section className="px-4 pb-20 sm:px-6 sm:pb-24">
      <div className="mx-auto max-w-6xl rounded-[2.5rem] bg-clay px-6 py-16 text-center text-cream sm:py-20">
        <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold sm:text-5xl">
          Your next hobby is one cozy afternoon away.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-cream/80">
          {duration} · all materials included · Ellicott City, MD.
          Bring a friend — it's more fun that way.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-cream px-8 py-4 font-semibold text-ink transition hover:bg-white"
          >
            <MessageCircle className="h-4 w-4" /> Book via DM
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-cream/40 px-8 py-4 font-semibold text-cream transition hover:border-cream"
          >
            <Instagram className="h-4 w-4" /> @muglee_mugs
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-ink/10 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-ink-soft sm:flex-row sm:px-6">
        <p className="font-display text-lg font-semibold text-ink">
          muglee<span className="text-clay">·</span>mugs
        </p>
        <p>Sip &amp; Crochet workshops · Ellicott City, MD</p>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 font-semibold text-ink hover:text-clay"
        >
          <Instagram className="h-4 w-4" /> @muglee_mugs
        </a>
      </div>
    </footer>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [siteContent, setSiteContent] = useState({
    price: 30,
    duration: "2 hours",
    hero_title: "Sip, stitch & learn crochet in one cozy afternoon.",
    hero_subtitle: "A 2-hour beginner-friendly Sip & Crochet workshop. All materials included, zero experience needed.",
  });

  useEffect(() => {
    loadSiteContent();
    const handleHashChange = () => {
      if (window.location.hash === "#/admin") {
        setPage("admin");
      } else {
        setPage("home");
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const loadSiteContent = async () => {
    try {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .eq("id", 1)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      if (data) {
        setSiteContent((prev) => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.error("Error loading site content:", err);
    }
  };

  if (page === "admin") {
    return <AdminPage />;
  }

  return (
    <div className="min-h-screen">
      <Nav />
      <div className="fixed bottom-4 right-4 z-40">
        <a
          href="#/admin"
          title="Admin panel"
          className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-ink/90 text-cream hover:bg-ink shadow-lg transition"
        >
          <Lock className="h-5 w-5" />
        </a>
      </div>
      <main>
        <Hero price={siteContent.price} duration={siteContent.duration} />
        <StatsStrip duration={siteContent.duration} />
        <Workshops />
        <Learn />
        <HowItWorks />
        <Gallery />
        <Faq />
        <About />
        <FinalCta duration={siteContent.duration} />
      </main>
      <Footer />
    </div>
  );
}
