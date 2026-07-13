import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/media")({
  head: () => ({
    meta: [
      { title: "Media — Dorottya Litkei" },
      {
        name: "description",
        content:
          "Press, interviews and features about Dorottya Litkei — including her exclusive Sportál portrait interview on pole sport, purpose and the road to the World Championship.",
      },
      { property: "og:title", content: "Media — Dorottya Litkei" },
      {
        property: "og:description",
        content: "Interviews and press features with Dorottya Litkei.",
      },
      { property: "og:url", content: "/media" },
    ],
    links: [{ rel: "canonical", href: "/media" }],
  }),
  component: Media,
});

function Media() {
  return (
    <>
      <section className="pt-32 md:pt-40 pb-16 bg-cream">
        <div className="container-luxe">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">
              <span className="gold-line mr-4 align-middle" />Media
            </p>
            <h1 className="mt-8 font-serif text-[clamp(2.75rem,6vw,5.5rem)] leading-[1.02]">
              Press &amp; <em className="text-gold not-italic font-medium">features</em>.
            </h1>
            <p className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed">
              A collection of interviews and articles about Dorottya's work in
              pole sport — on stage, in the studio and beyond.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-luxe py-20 md:py-28">
        <Reveal className="max-w-2xl mb-12">
          <p className="eyebrow">
            <span className="gold-line mr-4 align-middle" />Interview
          </p>
          <h2 className="mt-6 font-serif text-4xl md:text-5xl leading-tight">
            An exclusive portrait interview with Dorottya Litkei.
          </h2>
          <p className="mt-6 text-sm tracking-[0.22em] uppercase text-muted-foreground">
            Sportál · 27 August 2025 · by Botond Sziráki-Modla
          </p>
        </Reveal>

        <Reveal>
          <article className="mx-auto max-w-3xl font-serif text-lg md:text-xl leading-[1.75] text-foreground/90 space-y-6">
            <p className="italic text-muted-foreground">
              An exclusive portrait interview with Dorottya Litkei, one of the
              standout figures of Hungarian pole sport, on her past, present
              and future. The multiple Hungarian champion sat down with Botond
              Sziráki-Modla, journalist at Sportál.
            </p>

            <p>
              A fact few people know: in 2025 Hungary is hosting the
              international Pole and Aerial Sports World Championship. The
              organiser is the Hungarian Aerial Sports Federation (MALESZ),
              which has coordinated this segment of Hungarian sport since 2018,
              from 2024 as an official sport organisation. Between December 8
              and 14 this year they take a huge step forward, when the entire
              aerial sports world turns its attention to Hungary.
            </p>

            <p>
              MALESZ is the only Hungarian representative of the Pole Sports
              and Arts World Federation (POSA), which is how they earned the
              right to host this prestigious event on home soil.
            </p>

            <p>
              Although pole dance has been present in the country since 2008,
              it is still considered a niche pursuit — yet thousands can now
              call it part of their everyday lives. The federation, however,
              is very young, without access to state funding, and companies
              and private sponsors are not yet lining up to invest. The
              athletes are classed as amateurs, and even though Hungary has
              produced multiple European champions, those competitors have
              prepared, travelled and stayed at world events entirely at their
              own expense. This year's World Cup may prove to be the turning
              point.
            </p>

            <p>
              When I first landed on the MALESZ website, the very first image
              that greeted me was of today's interviewee — Dorottya Litkei —
              multiple Hungarian champion and, among many honours across her
              10-plus-year career, an amateur European champion. When I
              reached out to talk about the sport and about her, she answered
              every question honestly and directly. Although she said she'd
              never done anything like this before, she was composed and
              articulate throughout. We laughed a lot, and there were also
              genuinely tender moments, which I've tried to convey here to
              the best of my ability.
            </p>

            <p>
              Dorottya — or Dotti, as almost everyone calls her — invited me
              to one of her private training sessions so we could talk there;
              that way, she said, I could see what she does rather than just
              hear about it. She was already deep into her session when I
              arrived, working on her World Championship choreography.
            </p>

            <p>
              When I saw her, I didn't just see an athlete — I saw the
              embodiment of endurance and human strength. Behind the muscle
              lies an unbending will that has broken through every wall of
              the past ten years. I watched, in awe, as she rose above
              prejudice and carved a path where others might have found only
              closed doors or disbelief. Her movement isn't just about
              sport — it's about the possibility of human freedom. It was in
              that state of awe that I approached her with my questions,
              which she answered openly.
            </p>

            <h3 className="font-serif text-2xl md:text-3xl text-gold not-italic pt-6">
              What led you to pole sport? What was your athletic background?
            </h3>
            <p>
              As a child I already attended a sports school where I trained
              in both individual and team disciplines. At eight I started
              acrobatic rock &amp; roll, and it became clear that dance would
              be my form of fulfilment — I just didn't yet know in what
              shape. At fourteen I started Latin dance, and for the first
              time in my life I felt I had arrived. I still do it today as a
              hobby. I've put an unbelievable amount of work into making sure
              my movement — on the dance floor and on the pole — reflects my
              inner world in every circumstance. The intensity with which I
              threw myself into competitive dance isn't quite human — at
              least that's how I see it. Not to mention the period when, at
              nineteen, I met pole sport and started doing both in parallel.
              It was pure madness! — she laughs.
            </p>

            <h3 className="font-serif text-2xl md:text-3xl text-gold not-italic pt-6">
              Do you see yourself more as a Latin dancer or a pole athlete,
              given that dance is "only" a hobby now?
            </h3>
            <p>
              I get that question often — do I prefer dance or the pole? — and
              to this day I can't answer, because I feel one couldn't exist
              without the other anymore…
            </p>
            <blockquote className="border-l-2 border-gold pl-6 italic text-foreground">
              "But somewhere deep in my heart I'll always be more of a dancer
              and an artist than an athlete."
            </blockquote>

            <h3 className="font-serif text-2xl md:text-3xl text-gold not-italic pt-6">
              What drives you more in your career — the joy of movement or
              the promise of winning?
            </h3>
            <p>
              Clearly the first… which then brings the second — she laughs.
              I've always believed that if someone can be truly themselves on
              stage, that is far more lasting than any material thing, say a
              medal.
            </p>

            <p className="italic text-muted-foreground">
              While I listened, I pictured the beginnings: the childhood
              momentum, the first steps, the first dance classes. At that
              age you don't yet know what life is going to ask of you. You
              just feel the body move, and inside that movement lies the
              promise of freedom.
            </p>

            <h3 className="font-serif text-2xl md:text-3xl text-gold not-italic pt-6">
              When you hit walls — visible and invisible — what gives you the
              strength to cross them?
            </h3>
            <p>
              I won't say what I've achieved is down to luck, because I
              consciously shaped my life to live from my passion. I'm grateful
              for the environment and the people I get to work with. What
              gives me strength? Hm… Seeing what I've been through, where I
              came from, what personal victories I've had in my life. I can
              see how much depends on my own mind. My awareness is what
              propels me.
            </p>
            <blockquote className="border-l-2 border-gold pl-6 italic text-foreground">
              "I know I'm capable of creating anything I want for myself."
            </blockquote>

            <h3 className="font-serif text-2xl md:text-3xl text-gold not-italic pt-6">
              Has there been a day when you felt it might all be over? How
              does faith in the next step get reborn?
            </h3>
            <p>
              Yes, everyone has days like that. It's completely fine for
              things to change and for other things to become the priority.
              I don't want to stop teaching or leave pole sport, but by
              putting it in the right place in my life I've become much more
              balanced. I no longer want to sacrifice my whole life for it.
            </p>
            <blockquote className="border-l-2 border-gold pl-6 italic text-foreground">
              "This is an unwalked path that often feels frightening, but I
              believe this will be a wonderful chapter too."
            </blockquote>

            <h3 className="font-serif text-2xl md:text-3xl text-gold not-italic pt-6">
              What does the silence of training mean to you — a battle with
              yourself, or a spiritual journey?
            </h3>
            <blockquote className="border-l-2 border-gold pl-6 italic text-foreground">
              "More the latter. I feel an immeasurable gratitude in those
              moments. Seeing, feeling and experiencing what my body is
              capable of is unbelievable in itself."
            </blockquote>

            <p className="italic text-muted-foreground">
              As we talked about the struggle, I pictured those walls that
              most of us would only call obstacles. For her, every wall is a
              doorway. It's as if she finds a home in difficulty — as if
              fatigue and doubt are simply new terrains for her victories. I
              listen, and wonder: why does my own momentum break so easily?
              She, meanwhile, holds a rhythm as though endurance were nothing
              more than breath — natural, necessary, non-negotiable.
            </p>

            <h3 className="font-serif text-2xl md:text-3xl text-gold not-italic pt-6">
              How does it feel to face people who doubt you — and how do you
              turn their doubt into strength?
            </h3>
            <p>
              I engage with other people's opinions as little as possible. I
              am responsible for my own life; their thoughts aren't mine. So
              there's no opinion for me to fight.
            </p>
            <blockquote className="border-l-2 border-gold pl-6 italic text-foreground">
              "I stay open toward everyone when it comes to judgment."
            </blockquote>

            <h3 className="font-serif text-2xl md:text-3xl text-gold not-italic pt-6">
              Have you had to face prejudice born from people's lack of
              awareness? How did you handle it?
            </h3>
            <p>
              Thank God, personally — no! Have you seen these shoulders? —
              she flexes. — People see the athlete in me first and are more
              curious about what I do. The other day, for example, a
              stranger — an older lady — grabbed my bicep in a shop. — she
              laughs.
            </p>

            <h3 className="font-serif text-2xl md:text-3xl text-gold not-italic pt-6">
              If your career so far were a poem, would it be a sad one or a
              cheerful one?
            </h3>
            <blockquote className="border-l-2 border-gold pl-6 italic text-foreground">
              "Radnóti — Forced March. Or some kind of tragicomedy. Or
              something wryly motivating, in Örkény's style. The palette is
              quite colourful."
            </blockquote>

            <h3 className="font-serif text-2xl md:text-3xl text-gold not-italic pt-6">
              What colours and sounds would you use to describe your
              movement?
            </h3>
            <p>
              Colours? Hm — turquoise, grass green, orange, sun yellow, with
              a few black dots here and there. And there's one piece of music
              that's been defining for me my whole life. The main theme of
              The Theory of Everything — I think it was written for me. That
              is so Dotti — she smiles.
            </p>

            <p className="italic text-muted-foreground">
              When she speaks of movement as a poem, a melody rises in me
              too. I see her body writing lines into the air — every lift,
              every point of the toe another rhyme. Sport becomes poetry:
              a rhythm that echoes not only in the audience but inside us
              too. Listening to her, I realise that poetry might be hidden
              in my own everyday movements as well — if I dare to notice it.
            </p>

            <h3 className="font-serif text-2xl md:text-3xl text-gold not-italic pt-6">
              What path do you see ahead — rising peaks, or a slowly widening
              horizon?
            </h3>
            <p>
              I feel I climb my mountains differently now. I think I've
              reached my goals as a competitor and I'm content with that. It
              doesn't mean I don't want more or that I don't want to become
              the best version of myself again and again — but differently.
            </p>
            <blockquote className="border-l-2 border-gold pl-6 italic text-foreground">
              "Who knows — this year may be my last competition."
            </blockquote>

            <h3 className="font-serif text-2xl md:text-3xl text-gold not-italic pt-6">
              What would you like others to take away from what they see in
              you?
            </h3>
            <blockquote className="border-l-2 border-gold pl-6 italic text-foreground">
              "Live in the moment. Be present, let time stand still, and
              enjoy it."
            </blockquote>

            <h3 className="font-serif text-2xl md:text-3xl text-gold not-italic pt-6">
              Do you try to pass this mindset on to your students too? Your
              approach is very spiritual — are the students open to it?
            </h3>
            <p>
              I feel I find the right depth in my communication with everyone.
              They can count on me for many things — as a coach and as a
              person, I'm here for them. I want to show them there's another
              way. But of course, I'm not a missionary, and this isn't a
              cult! — she laughs.
            </p>

            <h3 className="font-serif text-2xl md:text-3xl text-gold not-italic pt-6">
              Which of your results as a competitor are you most proud of?
              Why?
            </h3>
            <p>
              That's a very hard question, because five come to mind at once.
              Each is special for a different reason, and I'm proud of every
              one.
            </p>

            <h3 className="font-serif text-2xl md:text-3xl text-gold not-italic pt-6">
              And as a coach?
            </h3>
            <p>
              ALL OF THEM! REGARDLESS OF AGE, GENDER, ANYTHING! Because it's
              my creations they take to the stage — and that is the most
              beautiful gesture a competitor can make for their coach. It's
              an honour that they chose me. Great responsibility and enormous
              trust. I try to bring the best out of everyone.
            </p>

            <h3 className="font-serif text-2xl md:text-3xl text-gold not-italic pt-6">
              What makes 2025 particularly special for you, with the Pole
              Sport World Championship being held at home?
            </h3>
            <p>
              Financially it'll certainly be lighter. I don't have to spend
              as much on travel and accommodation — she laughs. This year
              I'm preparing a piece no one is ready for. Not even me. I'm
              certain it will be an unforgettable year!
            </p>

            <h3 className="font-serif text-2xl md:text-3xl text-gold not-italic pt-6">
              Can you imagine pole sport becoming an Olympic discipline in
              your lifetime?
            </h3>
            <blockquote className="border-l-2 border-gold pl-6 italic text-foreground">
              "If it does, I definitely want to be part of it."
            </blockquote>

            <p>
              Those on the outside don't see how complex this sport is, how
              much preparation it demands and how little room there is for
              error. I think it deserves a chance at the Olympics — but
              unfortunately, in the supposedly enlightened society of the
              21st century, the mere mention of "the pole" still stirs
              prejudice in most people.
            </p>

            <p className="italic text-muted-foreground">
              When her last word fades, a silence settles between us. I know
              she wasn't only talking about her sport, but about how one
              stays human in a world where it would often be easier to give
              up. The endurance she radiates finds an echo in me too — as
              though she'd handed me a small piece of the strength I so
              admire. And so we stand: she on the stage, I in front of the
              screen — but both of our paths lead toward freedom.
            </p>

            <p className="pt-8 text-sm tracking-[0.22em] uppercase text-muted-foreground not-italic">
              Originally published in Hungarian on Sportál, 27 August 2025.
              Translated for reference.
            </p>
          </article>
        </Reveal>
      </section>
    </>
  );
}
