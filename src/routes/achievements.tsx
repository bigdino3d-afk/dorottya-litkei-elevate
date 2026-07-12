import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import stage from "@/assets/stage.jpg";

export const Route = createFileRoute("/achievements")({
  head: () => ({
    meta: [
      { title: "My Achievements — Dorottya Litkei" },
      {
        name: "description",
        content:
          "A record of Dorottya Litkei's competition results from 2014 to 2025, plus the podiums earned by her students across Hungarian, European and World championships.",
      },
      { property: "og:title", content: "My Achievements — Dorottya Litkei" },
      {
        property: "og:description",
        content: "National, European and World Pole Sport results — personal and coaching.",
      },
      { property: "og:url", content: "/achievements" },
    ],
    links: [{ rel: "canonical", href: "/achievements" }],
  }),
  component: Achievements,
});

type Result = { event: string; category?: string; place: string };
type Year = { year: string; items: Result[] };
type Student = { name: string; division: string; years: Year[] };

const PERSONAL: Year[] = [
  {
    year: "2025",
    items: [
      { event: "Hungarian Championship — Sport Qualification", place: "3rd" },
      { event: "POSA Sport World Championship", place: "11th" },
    ],
  },
  {
    year: "2023",
    items: [
      { event: "POSA Pole Sport Hungarian Championship", category: "Elite", place: "1st" },
      { event: "POSA Pole Art Hungarian Championship", category: "Elite", place: "1st" },
      { event: "POSA European Championship", category: "Elite", place: "5th" },
      { event: "Hungarian Cup", category: "Elite", place: "4th" },
      { event: "POSA Pole Art Championship", category: "Elite", place: "14th" },
    ],
  },
  {
    year: "2022",
    items: [
      { event: "Pole Artistic Hungary", category: "Elite", place: "1st" },
      { event: "Hungarian Cup", category: "Elite", place: "1st" },
      { event: "POSA Pole Art Championship", category: "Elite", place: "14th" },
      { event: "POSA Pole Sport Championship", category: "Elite", place: "8th" },
    ],
  },
  {
    year: "2021",
    items: [
      { event: "POSA Pole Sport Hungarian Championship", category: "Elite", place: "1st" },
      { event: "Pole Artistic Hungary", category: "Elite", place: "1st" },
      { event: "Pole Art Italy", category: "Elite", place: "6th" },
      { event: "POSA Pole Art Championship", category: "Elite", place: "6th" },
    ],
  },
  {
    year: "2020",
    items: [
      { event: "POSA Pole Sport Hungarian Championship", category: "Elite", place: "1st" },
      { event: "Hungarian Cup", category: "Pro", place: "1st" },
    ],
  },
  {
    year: "2019",
    items: [
      { event: "Aerial Universe Championship", category: "Pro", place: "4th" },
      { event: "PoleArt Hungary", category: "Pro", place: "4th" },
      { event: "POSA Pole Sport Hungarian Championship", category: "Elite", place: "2nd" },
    ],
  },
  {
    year: "2018",
    items: [
      { event: "PoleArt Croatia", category: "Pro", place: "4th" },
      { event: "Restart Pole Sport", category: "Elite", place: "1st" },
      { event: "PoleArt Hungary", category: "Pro", place: "2nd" },
    ],
  },
  {
    year: "2017",
    items: [
      { event: "PoleArt Hungary", category: "Pro", place: "3rd" },
      { event: "Restart Pole Sport Competition", category: "Elite", place: "2nd" },
    ],
  },
  {
    year: "2016",
    items: [
      { event: "IPSF Pole Sport Championship", category: "Pro", place: "2nd" },
      { event: "European Pole Sport Championship", category: "Amateur", place: "1st" },
      { event: "PoleArt Hungary", category: "Pro", place: "1st" },
    ],
  },
  {
    year: "2015",
    items: [
      { event: "II. Dance Factory Cup", place: "2nd" },
      { event: "Pole Fitness Beauty", place: "2nd" },
    ],
  },
  {
    year: "2014",
    items: [
      { event: "Hungarian Pole Sport Championship", category: "Amateur", place: "2nd" },
      { event: "IPSF Pole Sport Championship", category: "Amateur / 2", place: "1st" },
    ],
  },
];

const STUDENTS: Student[] = [
  {
    name: "Panna Perényi",
    division: "Junior A",
    years: [
      {
        year: "2025",
        items: [
          { event: "Hungarian Championship", place: "2nd" },
          { event: "POSA European Championship", place: "10th" },
          { event: "Hungarian Cup", place: "1st" },
        ],
      },
      {
        year: "2024",
        items: [{ event: "POSA European Championship", place: "8th" }],
      },
    ],
  },
  {
    name: "Menta Czakó-Ugróczky",
    division: "Junior B",
    years: [
      {
        year: "2023",
        items: [
          { event: "Hungarian Cup", place: "4th" },
          { event: "Hungarian Championship", place: "5th" },
        ],
      },
      {
        year: "2022",
        items: [
          { event: "Pole Artistic", place: "3rd" },
          { event: "MALESZ Cup", place: "1st" },
          { event: "Hungarian Cup", place: "1st" },
        ],
      },
      {
        year: "2019",
        items: [{ event: "Queen Pole", place: "3rd" }],
      },
    ],
  },
  {
    name: "Minka Giret",
    division: "Junior B",
    years: [
      {
        year: "2025",
        items: [{ event: "Hungarian Championship — Sport", place: "4th" }],
      },
      {
        year: "2024",
        items: [
          { event: "MALESZ Sport", place: "3rd" },
          { event: "MALESZ Art", place: "4th" },
          { event: "POSA Sport European Championship", place: "7th" },
          { event: "POSA Sport World Championship", place: "9th" },
          { event: "PAAH", place: "3rd" },
        ],
      },
      {
        year: "2023",
        items: [
          { event: "MALESZ Sport", place: "5th" },
          { event: "MALESZ Cup", place: "2nd" },
          { event: "PAAH", place: "1st" },
        ],
      },
      {
        year: "2022",
        items: [
          { event: "MALESZ Sport", place: "4th" },
          { event: "PAAH", place: "2nd + Special Technical Award" },
          { event: "POSA Sport World Championship", place: "11th" },
        ],
      },
    ],
  },
  {
    name: "Fanni Karsai",
    division: "Junior B",
    years: [
      {
        year: "2024",
        items: [
          { event: "TRL Championship", place: "3rd" },
          { event: "Pole Artistic Hungary", place: "4th" },
          { event: "MALESZ Sport Hungarian Championship", place: "5th" },
          { event: "MALESZ Art Hungarian Championship", place: "4th" },
          { event: "POSA Sport European Championship", place: "6th" },
          { event: "POSA Art World Championship", place: "13th" },
          { event: "PAAH", place: "2nd" },
        ],
      },
      {
        year: "2023",
        items: [
          { event: "MALESZ Sport Hungarian Championship", place: "2nd" },
          { event: "Pole Artistic Hungary", place: "3rd" },
          { event: "MALESZ Art Hungarian Championship", place: "2nd" },
          { event: "POSA Sport European Championship", place: "4th" },
          { event: "MALESZ Hungarian Cup", place: "3rd" },
          { event: "PAAH", place: "2nd" },
          { event: "POSA Sport World Championship", place: "6th" },
          { event: "POSA Art World Championship", place: "7th" },
        ],
      },
      {
        year: "2022",
        items: [
          { event: "MALESZ Sport Hungarian Championship", place: "3rd" },
          { event: "MALESZ Hungarian Cup", place: "2nd" },
          { event: "PAAH", place: "4th" },
          { event: "POSA Sport World Championship", place: "15th" },
        ],
      },
    ],
  },
  {
    name: "Nóra Pável",
    division: "Senior",
    years: [
      {
        year: "2024",
        items: [
          { event: "POSA Sport Hungarian Championship", place: "1st" },
          { event: "POSA Art Hungarian Championship", place: "2nd" },
          { event: "POSA Sport European Championship", place: "1st" },
          { event: "POSA Sport World Championship", place: "7th" },
        ],
      },
      {
        year: "2023",
        items: [
          { event: "POSA Sport Hungarian Championship", place: "4th" },
          { event: "POSA Art Hungarian Championship", place: "2nd" },
          { event: "POSA European Championship", place: "9th" },
          { event: "Hungarian Cup", place: "3rd" },
          { event: "POSA Art World Championship", place: "4th" },
        ],
      },
    ],
  },
  {
    name: "Nikolett Germán",
    division: "Senior",
    years: [
      {
        year: "2024",
        items: [
          { event: "TRL Championship", place: "1st" },
          { event: "Pole Artistic Hungary", place: "11th" },
          { event: "Hungarian Cup", place: "1st" },
          { event: "PAAH", place: "6th" },
        ],
      },
    ],
  },
  {
    name: "Nóri Adonyi",
    division: "Senior",
    years: [
      {
        year: "2024",
        items: [
          { event: "Pole Artistic Hungary", place: "2nd" },
          { event: "Hungarian Sport Championship", place: "1st" },
          { event: "Hungarian Art Championship", place: "3rd" },
          { event: "POSA Sport EC — Masters", place: "3rd" },
          { event: "PAAH Adult", place: "1st" },
          { event: "POSA Art WC — Masters", place: "2nd" },
        ],
      },
      {
        year: "2023",
        items: [
          { event: "Hungarian Art Championship", place: "3rd" },
          { event: "POSA Art World Championship", place: "2nd" },
        ],
      },
      {
        year: "2022",
        items: [{ event: "Hungarian Cup", place: "2nd" }],
      },
    ],
  },
  {
    name: "Sára Mozga",
    division: "Senior",
    years: [
      {
        year: "2024",
        items: [
          { event: "MALESZ Hungarian Cup", place: "2nd" },
          { event: "POSA Sport Hungarian Championship", place: "4th" },
          { event: "Pole and Aerial Hungary", place: "2nd" },
        ],
      },
      {
        year: "2023",
        items: [
          { event: "MALESZ Hungarian Cup", place: "1st" },
          { event: "POSA Sport Hungarian Championship", place: "4th" },
        ],
      },
      {
        year: "2022",
        items: [{ event: "MALESZ Hungarian Cup", place: "2nd" }],
      },
    ],
  },
  {
    name: "Anita Forgács",
    division: "Masters 40+",
    years: [
      {
        year: "2024",
        items: [
          { event: "MALESZ Pole Sport Hungarian Championship", place: "1st" },
          { event: "MALESZ Pole Art Hungarian Championship", category: "Elite", place: "1st" },
          { event: "POSA Pole Sport European Championship", place: "1st" },
          { event: "MALESZ Rules Hungarian Cup", category: "Pro", place: "1st" },
          { event: "POSA Pole Sport World Championship", category: "Competitive", place: "2nd" },
        ],
      },
      {
        year: "2023",
        items: [
          { event: "MALESZ Hungarian Championship", place: "2nd" },
          { event: "MALESZ Pole Art Hungarian Championship", category: "Elite", place: "2nd" },
          { event: "POSA European Pole Sport Championship", place: "7th" },
          { event: "CSIT Pole Sport World Cup", place: "1st" },
          { event: "MALESZ Rules Hungarian Cup", place: "1st" },
          { event: "POSA Pole Sport World Championship", place: "4th" },
        ],
      },
      {
        year: "2022",
        items: [
          { event: "MALESZ Cup", category: "Pro", place: "1st" },
          { event: "POSA World Art Championship", category: "Elite", place: "10th" },
        ],
      },
    ],
  },
  {
    name: "Zsuzsanna Bálint",
    division: "Masters 40+",
    years: [
      {
        year: "2024",
        items: [
          { event: "Pole Artistic Hungary", place: "5th" },
          { event: "POSA Art", place: "5th" },
          { event: "MALESZ Hungarian Championship", place: "2nd" },
        ],
      },
    ],
  },
  {
    name: "Anita Kovács",
    division: "Masters 50+",
    years: [
      {
        year: "2024",
        items: [
          { event: "Pole Artistic Hungary", category: "Pro", place: "1st" },
          { event: "PAAH 44+", category: "Pro", place: "1st" },
          { event: "MALESZ Sport Hungarian Championship", place: "1st" },
          { event: "MALESZ Art Hungarian Championship", place: "1st" },
          { event: "POSA Pole Sport EC San Severo", category: "50+ Pro", place: "2nd" },
          { event: "POSA Pole Sport WC Cesenatico", category: "50+ Pro", place: "3rd" },
          { event: "POSA Pole Art WC Rome", category: "50+ Elite", place: "3rd" },
        ],
      },
      {
        year: "2023",
        items: [
          { event: "Pole Artistic Hungary", place: "1st" },
          { event: "MALESZ Sport Hungarian Championship", place: "1st" },
          { event: "MALESZ Art Hungarian Championship", place: "1st" },
          { event: "POSA Pole Sport European Championship", place: "4th" },
          { event: "POSA Pole Sport World Championship", place: "2nd" },
          { event: "POSA Pole Art World Championship — Barcelona", place: "1st" },
        ],
      },
      {
        year: "2022",
        items: [{ event: "PAAH 40+", place: "1st" }],
      },
    ],
  },
];

type FlatResult = Result & { year: string };

function flatten(years: Year[]): FlatResult[] {
  return years
    .flatMap((y) => y.items.map((r) => ({ ...r, year: y.year })))
    .sort((a, b) => Number(a.year) - Number(b.year));
}

function placeAccent(place: string) {
  const n = parseInt(place, 10);
  if (n === 1) return "text-gold";
  if (n === 2 || n === 3) return "text-foreground";
  return "text-muted-foreground";
}

function ResultLine({ r }: { r: FlatResult }) {
  return (
    <li className="grid grid-cols-[3.5rem_1fr_auto] items-baseline gap-4 md:gap-6 border-t border-border py-3">
      <span className="font-serif text-base md:text-lg text-muted-foreground tabular-nums">
        {r.year}
      </span>
      <span className="min-w-0">
        <span className="font-serif text-base md:text-lg leading-snug">{r.event}</span>
        {r.category && (
          <span className="ml-2 text-[0.7rem] tracking-[0.2em] uppercase text-muted-foreground">
            · {r.category}
          </span>
        )}
      </span>
      <span className={`shrink-0 font-serif text-lg md:text-xl tabular-nums ${placeAccent(r.place)}`}>
        {r.place}
      </span>
    </li>
  );
}

function ResultList({ results }: { results: FlatResult[] }) {
  return (
    <ul className="border-b border-border">
      {results.map((r, i) => (
        <ResultLine key={i} r={r} />
      ))}
    </ul>
  );
}

function PersonBlock({
  name,
  division,
  results,
}: {
  name: string;
  division?: string;
  results: FlatResult[];
}) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-foreground/40 pb-3 mb-2">
        <h3 className="font-serif text-2xl md:text-3xl leading-tight">{name}</h3>
        {division && (
          <p className="font-serif italic text-lg md:text-xl text-gold">{division}</p>
        )}
      </div>
      <ResultList results={results} />
    </div>
  );
}

function Achievements() {
  const personalFlat = flatten(PERSONAL);
  const studentsByDivision = STUDENTS.reduce<Record<string, Student[]>>((acc, s) => {
    (acc[s.division] ||= []).push(s);
    return acc;
  }, {});
  const divisions = Object.keys(studentsByDivision);

  return (
    <>
      <section className="pt-32 md:pt-40 pb-16 bg-cream">
        <div className="container-luxe">
          <Reveal className="max-w-3xl">
            <p className="eyebrow"><span className="gold-line mr-4 align-middle" />My Achievements</p>
            <h1 className="mt-8 font-serif text-[clamp(2.75rem,6vw,5.5rem)] leading-[1.02]">
              A record built on the <em className="text-gold not-italic font-medium">podium</em>.
            </h1>
            <p className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed">
              Personal results and the podiums earned by the students I've
              coached across Hungarian, European and World championships.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-luxe py-20 md:py-28">
        <Reveal className="max-w-2xl mb-12 md:mb-16">
          <p className="eyebrow"><span className="gold-line mr-4 align-middle" />Personal Results</p>
          <h2 className="mt-6 font-serif text-4xl md:text-5xl">Competition record.</h2>
        </Reveal>
        <Reveal>
          <PersonBlock name="Dorottya Litkei" division="Elite" results={personalFlat} />
        </Reveal>
      </section>

      <section className="relative py-24 md:py-32 bg-ink text-white overflow-hidden">
        <img src={stage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" loading="lazy" />
        <div className="relative container-luxe">
          <Reveal className="max-w-2xl">
            <p className="eyebrow text-white/60"><span className="gold-line mr-4 align-middle" />Student Results</p>
            <h2 className="mt-6 font-serif text-white text-4xl md:text-5xl">
              Coached to the top step.
            </h2>
            <p className="mt-6 text-white/70 max-w-xl leading-relaxed">
              The athletes I've had the privilege to prepare — grouped by
              category — and the results they've earned on national and
              international stages.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-luxe py-20 md:py-28 space-y-20 md:space-y-24">
        {divisions.map((division) => (
          <Reveal key={division}>
            <div>
              <div className="flex items-baseline justify-between mb-10">
                <p className="eyebrow text-gold">{division}</p>
                <p className="text-xs tracking-[0.22em] uppercase text-muted-foreground">
                  {studentsByDivision[division].length}{" "}
                  {studentsByDivision[division].length === 1 ? "athlete" : "athletes"}
                </p>
              </div>
              <div className="space-y-14 md:space-y-16">
                {studentsByDivision[division].map((s) => (
                  <PersonBlock
                    key={s.name}
                    name={s.name}
                    division={s.division}
                    results={flatten(s.years)}
                  />
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </section>

      <section className="bg-cream">
        <div className="container-luxe py-24 text-center">
          <Reveal className="max-w-xl mx-auto">
            <h2 className="font-serif text-4xl md:text-5xl">Train like a warrior.</h2>
            <p className="mt-6 text-muted-foreground">
              Whether you're preparing for your first competition or your tenth,
              the process starts with a single lesson.
            </p>
            <Link to="/booking" className="btn-luxe btn-luxe-hover mt-10">Book a Lesson</Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}


