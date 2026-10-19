import type { WorkGalleryItem, WorkItem } from "@/lib/schemas/work";

const VPN_GALLERY_APPS = [
  { slug: "aviteovpn", caption: "AviteoVPN" },
  { slug: "digitunnel-vpn", caption: "Digitunnel VPN" },
  { slug: "gatewayvpn", caption: "GatewayVPN" },
  { slug: "vpnsec", caption: "VpnSec" },
] as const;

function vpnGalleryItems(): WorkGalleryItem[] {
  const cover: WorkGalleryItem = {
    src: "/projects/white-label-vpn-sdk/gallery/gatewayvpn-cover.webp",
    alt: "GatewayVPN cover",
    caption: "GatewayVPN",
  };

  const shots = VPN_GALLERY_APPS.flatMap(({ slug, caption }) =>
    Array.from({ length: 8 }, (_, index) => {
      const frame = String(index + 1).padStart(2, "0");
      return {
        src: `/projects/white-label-vpn-sdk/gallery/${slug}-${frame}.webp`,
        alt: `${caption} screenshot`,
        caption,
      };
    }),
  );

  return [cover, ...shots];
}

const updatedAt = "2026-10-18T00:00:00.000Z";

const workItems: WorkItem[] = [
  {
    id: "work-trinnect",
    slug: "trinnect",
    title: "Trinnect",
    category: "ai-systems",
    summary:
      "A location-based social app for meeting people nearby, shipped from a Lovable web app through pipelines that build, test, and go live on the web and the App Store.",
    role: "GenAI engineer",
    company: "Trinnect",
    period: "2026",
    stack: ["React", "Capacitor", "Supabase", "React Native"],
    highlights: [
      "Lovable prompt to a live web and App Store release",
      "Capacitor iOS and Android, plus a React Native version",
      "Shared build and test gate before every ship",
    ],
    body: `Trinnect started life as a Lovable web app. I put automated pipelines around it so a feature the client prompts in Lovable gets built, tested, and shipped live to the web and the App Store.

The product is a location-based social app for meeting people nearby. I shipped it on iOS and Android with Capacitor, and also worked on a React Native version of the same app.

RAYKIRI PTY LTD can keep moving without a separate release ritual. Prompt in Lovable, pipelines do the rest.`,
    coverUrl: "/projects/trinnect/cover.webp",
    links: [
      {
        label: "App Store",
        href: "https://apps.apple.com/ae/app/trinnect/id6758113133",
      },
    ],
    order: 0,
    status: "published",
    featured: true,
    updatedAt,
  },
  {
    id: "work-terranzo",
    slug: "terranzo",
    title: "Terranzo",
    category: "ai-systems",
    summary:
      "Research and plan a move abroad — a Lovable web app that pipelines ship live to the web and the stores, with Capgo over-the-air updates.",
    role: "GenAI engineer",
    company: "Terranzo",
    period: "2025–2026",
    stack: ["React", "Supabase", "Capacitor", "Swift/SwiftUI", "Capgo"],
    highlights: [
      "Lovable prompt to live web, App Store, and Google Play",
      "Capacitor first, then a native SwiftUI iOS app",
      "Capgo over-the-air updates without waiting on store review",
    ],
    body: `Terranzo is for people who are serious about moving abroad. You match to cities on what actually matters to you, compare them side by side, and get a real monthly cost for your household.

This one is an AI-native workflow end to end. The client prompts a feature in Lovable, and the pipelines I built take it live to the web and the app stores. I set up Capacitor first, then rebuilt iOS natively in SwiftUI. Capgo pushes over-the-air updates so a change can reach people without waiting on store review.

Terranzo LLC runs the product themselves. They prompt. It ships.`,
    coverUrl: "/projects/terranzo/cover.webp",
    links: [
      {
        label: "App Store",
        href: "https://apps.apple.com/ae/app/terranzo/id6761512459",
      },
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.terranzo.app",
      },
    ],
    order: 1,
    status: "published",
    featured: true,
    updatedAt,
  },
  {
    id: "work-my-float",
    slug: "my-float",
    title: "My Float by I-Sense",
    category: "ai-systems",
    summary:
      "Float-tank control from a Lovable web app, turned into iOS and Android with Capacitor, Capgo live updates, and pipelines that ship a prompt to production.",
    role: "GenAI engineer",
    company: "I-Sense",
    period: "2026",
    stack: ["React", "TypeScript", "Supabase", "Capacitor", "Capgo"],
    highlights: [
      "Lovable CRM web app turned into iOS and Android",
      "Automated prompt-to-store pipeline for web and mobile",
      "Capgo live updates so fixes skip a full store release",
    ],
    body: `My Float is how I-Sense float centres and private owners watch their tanks from anywhere: live water temperature, starting and stopping sessions, music, filtration, dosing, alerts, and the maintenance schedule.

The I-Sense CRM started as a Lovable web app. I turned it into Android and iOS with Capacitor, then built the automated pipelines so a feature prompt in Lovable is built, tested, and live on the web and the stores. Capgo covers over-the-air updates, so a fix does not sit in review.

They maintain it themselves. A prompt in Lovable is enough to ship.`,
    coverUrl: "/projects/my-float/cover.webp",
    links: [
      {
        label: "App Store",
        href: "https://apps.apple.com/ae/app/my-float-by-i-sense/id6450182885",
      },
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.isensefloat.app",
      },
    ],
    order: 2,
    status: "published",
    featured: true,
    updatedAt,
  },
  {
    id: "work-fast-brix",
    slug: "fast-brix",
    title: "Fast Brix",
    category: "ai-systems",
    summary:
      "Family brick-building challenges on web and mobile, shipped from a Lovable prompt through pipelines to the App Store and Google Play.",
    role: "GenAI engineer",
    company: "America Learns",
    period: "2026",
    stack: ["React", "Supabase", "Capacitor", "Firebase"],
    highlights: [
      "Lovable prompt to live web and both app stores",
      "iOS and Android builds plus push notifications",
      "Kid-safe gallery, multiplayer, and a weekly leaderboard",
    ],
    body: `Fast Brix turns a brick collection into short, funny building challenges for families. You get a random challenge, build it before the timer runs out, then share a photo or video in a kid-safe gallery. Multiplayer uses a shared code, with voting and a weekly leaderboard.

America Learns LLC started it in Lovable. I built the web and mobile app, the iOS and Android builds, push notifications, and the pipelines that take a Lovable prompt through build and test and out to the web and both stores.

A feature prompt is enough to go live. They run the product themselves.`,
    coverUrl: "/projects/fast-brix/cover.webp",
    links: [
      {
        label: "App Store",
        href: "https://apps.apple.com/ae/app/fast-brix/id6762238869",
      },
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.fastbrix",
      },
    ],
    order: 3,
    status: "published",
    featured: true,
    updatedAt,
  },
  {
    id: "work-vigil",
    slug: "vigil",
    title: "Vigil",
    category: "ai-systems",
    summary:
      "Daily scripture reflection and journaling, started in Lovable and shipped to the App Store with a dedicated iPad layout.",
    role: "GenAI engineer",
    company: "Vigil Interactive",
    period: "2026",
    stack: ["Capacitor", "Supabase", "JavaScript"],
    highlights: [
      "Lovable web app carried through to a store release",
      "Dedicated iPad layout that passed App Store review",
      "Mirror, Window, and Lens reflection flow",
    ],
    body: `Vigil is a daily scripture reflection and journaling app. Each sitting walks through Mirror, Window, and Lens, with guided prompts, a photo you carry back into the day, and space for churches and small groups.

It began as a Lovable web app. I worked on the Capacitor app and the pipelines that take a prompt through to a live web and store release. The dedicated iPad layout is what got it through App Store review.

Vigil Interactive LLC has it on the App Store as Vigil: Daily Reflection.`,
    coverUrl: "/projects/vigil/cover.webp",
    links: [
      {
        label: "App Store",
        href: "https://apps.apple.com/ae/app/vigil-daily-reflection/id6797204881",
      },
    ],
    order: 4,
    status: "published",
    featured: true,
    updatedAt,
  },
  {
    id: "work-wellspent",
    slug: "wellspent",
    title: "Wellspent Screen Time SDK",
    category: "products",
    summary:
      "A React Native wrapper around a native Swift screen-time SDK, so RN apps can plug those features in without rewriting Swift.",
    role: "GenAI engineer",
    company: "Wellspent",
    period: "2025",
    stack: ["React Native", "Swift", "Native Modules"],
    highlights: [
      "React Native bridge over a native Swift SDK",
      "Screen-time budgets and full-screen check-ins",
      "Plug-in path for RN apps that should not rewrite Swift",
    ],
    body: `Wellspent helps people cut doomscrolling. You set time budgets for the apps that eat your day, and it interrupts with a short full-screen check-in in a tone you pick, plus a progress score and a few short exercises.

The screen-time features live in a native Swift SDK. I wrapped that SDK for React Native with native modules, so a React Native app can use the same features without rewriting the Swift.

Most of the work was the bridge: native APIs on one side, JavaScript on the other, clean enough to drop in.`,
    coverUrl: "/projects/wellspent/cover.webp",
    links: [
      {
        label: "App Store",
        href: "https://apps.apple.com/ae/app/wellspent-replace-scrolling/id1643980844",
      },
    ],
    order: 5,
    status: "published",
    featured: false,
    updatedAt,
  },
  {
    id: "work-white-label-vpn-sdk",
    slug: "white-label-vpn-sdk",
    title: "White Label VPN SDK",
    category: "products",
    summary:
      "A white-label VPN SDK and app platform for Android, iOS, Windows, and macOS, shipped as multiple branded VPN apps from one shared core.",
    role: "GenAI engineer",
    company: "PureSquare",
    period: "2023–2025",
    stack: ["React Native", "Swift", "Kotlin", "Redux", "Node.js"],
    highlights: [
      "Modular SDK for branded VPN apps",
      "Native bridges in Swift and Kotlin",
      "AviteoVPN, Digitunnel VPN, GatewayVPN, VpnSec, and InnoviaShield VPN",
    ],
    body: `I built a white-label VPN SDK and app platform that branded VPN apps sit on. Native bridges in Swift and Kotlin carry the sensitive work; React Native, Redux, and Node.js cover the shared app layer across Android, iOS, Windows, and macOS.

The same SDK shipped as AviteoVPN, Digitunnel VPN, GatewayVPN, VpnSec, and InnoviaShield VPN. One core, a different brand on the home screen.

A team gets a production VPN app without starting the networking and security stack from zero.`,
    coverUrl: "/projects/white-label-vpn-sdk/cover.webp",
    gallery: vpnGalleryItems(),
    order: 6,
    status: "published",
    featured: false,
    updatedAt,
  },
  {
    id: "work-luviq",
    slug: "luviq",
    title: "LuvIQ",
    category: "products",
    summary:
      "Relationship insights app I led on iOS and Android, from sign-in and core features through to push notifications.",
    role: "GenAI engineer",
    company: "LuvIQ",
    period: "2026",
    stack: ["React Native", "TypeScript", "Firebase", "Zustand"],
    highlights: [
      "Main developer on iOS and Android",
      "Google and Apple sign-in plus Superwall paywalls",
      "Firebase auth, messaging, and push notifications",
    ],
    body: `LuvIQ is a relationship app that tries to replace guesswork with a clearer picture of who you are actually looking for. It builds a Dream Partner Profile, a roadmap, and suggestions for where to meet people.

I was the main developer on the iOS and Android app, from sign-in and the core features through to push notifications. React Native and TypeScript on the surface, Zustand for state, Firebase for auth and messaging, plus Google and Apple sign-in, Superwall paywalls, and motion via Reanimated, bottom sheets, and Lottie.

It shipped as a full mobile app, wired for purchases and notifications, not a throwaway prototype.`,
    coverUrl: "/projects/luviq/cover.webp",
    links: [{ label: "Live", href: "https://luviq.app" }],
    order: 8,
    status: "published",
    featured: false,
    updatedAt,
  },
  {
    id: "work-escrow-trakker-landlords",
    slug: "escrow-trakker-landlords",
    title: "Escrow Trakker for Landlords",
    category: "products",
    summary:
      "Property app for tracking tenant deposits, leases, and trust accounting so landlords stay on the right side of state deposit rules.",
    role: "GenAI engineer",
    company: "Code Avenue",
    period: "2021",
    stack: ["React Native", "Firebase"],
    highlights: [
      "Tenant, property, and deposit tracking in one app",
      "Automated statements, interest, and reconciliation reports",
      "Cloud access on phone, tablet, or desktop",
    ],
    body: `Escrow Trakker for Landlords is for people who hold tenant deposits in trust. If those funds are handled badly, a landlord can lose the right to withhold any of them.

I built the app in React Native with Firebase. Landlords add tenants and properties, enter deposits and withdrawals, and reconcile against the bank. The app writes the itemised statements, interest, and the reports you actually need: 3-way reconciliation, trial balance, profit and loss.

Everything lives in the cloud, so it works on a phone, tablet, or desktop, with a passcode or fingerprint on the way in.`,
    coverUrl: "/projects/escrow-trakker-landlords/cover.webp",
    order: 13,
    status: "published",
    featured: false,
    updatedAt,
  },
  {
    id: "work-escrow-trakker-lawyers",
    slug: "escrow-trakker-lawyers",
    title: "Escrow Trakker for Lawyers",
    category: "products",
    summary:
      "Trust and IOLTA accounting for law firms, replacing spreadsheet ledgers with tagged transactions and automated reconciliation.",
    role: "GenAI engineer",
    company: "Code Avenue",
    period: "2020–2021",
    stack: ["React Native", "Cloud"],
    highlights: [
      "Trust and IOLTA accounts in one ledger",
      "Monthly 3-way reconciliation and client statements",
      "Balances by job, client, lawyer, or the whole firm",
    ],
    body: `Escrow Trakker for Lawyers is trust and IOLTA accounting without the spreadsheet. Firms track client money held in trust across many bank accounts.

I built it in React Native on a cloud backend. You can run a large set of trust and IOLTA accounts, tag each deposit or withdrawal with an account, customer, job, and lawyer, and let the app do the monthly grind: 3-way reconciliation, client statements, trial balance, ledgers, and overdraw alerts.

Charts break balances down by job, client, lawyer, or the whole firm. That is the difference between a ledger and a tool people will actually open.`,
    coverUrl: "/projects/escrow-trakker-lawyers/cover.webp",
    order: 14,
    status: "published",
    featured: false,
    updatedAt,
  },
  {
    id: "work-al-rayyan-tv",
    slug: "al-rayyan-tv",
    title: "Al Rayyan TV",
    category: "client-apps",
    summary:
      "Live TV and programs app for a Qatari satellite channel, built in Ionic and Angular and live on both stores.",
    role: "GenAI engineer — client delivery",
    company: "Al Rayyan Productions",
    period: "2022–2023",
    stack: ["Ionic", "Angular"],
    highlights: [
      "Live broadcast and program guide in one app",
      "Comments, ideas, and social links back to the channel",
      "Live on the App Store and Google Play",
    ],
    body: `Al Rayyan TV is a Qatari satellite channel. The app is meant to put the channel in someone's pocket: live broadcast, the program guide, comments, and a path out to the channel's social accounts.

I built it in Ionic and Angular so viewers can watch live, browse programs, send a note, and share what they are watching.

It is on the App Store and Google Play. Android is past 50,000 installs.`,
    coverUrl: "/projects/al-rayyan-tv/cover.webp",
    links: [
      {
        label: "App Store",
        href: "https://apps.apple.com/us/app/al-rayyan-tv/id672645332",
      },
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.LinkDev.Alrayyan.App",
      },
    ],
    order: 17,
    status: "published",
    featured: false,
    updatedAt,
  },
  {
    id: "work-banoon",
    slug: "banoon",
    title: "Banoon",
    category: "client-apps",
    summary:
      "Kids and baby shopping app for a Riyadh store, with filters, fast delivery, and app-only deals on iOS and Android.",
    role: "GenAI engineer — client delivery",
    company: "Banoon",
    period: "2024–2025",
    stack: ["iOS", "Android"],
    highlights: [
      "Full store range for newborns through teens",
      "Product filters and app-only deals",
      "Live on the App Store and Google Play",
    ],
    body: `Banoon is a Riyadh shop for parents. Clothes, toys, and the rest for newborns through teens, with fast delivery and deals that live in the app.

I worked on the iOS and Android app so someone can browse the full range, filter products, and order from one place.

It has been on both stores since 2025 and has kept getting regular updates, including better product filters.`,
    coverUrl: "/projects/banoon/cover.webp",
    links: [
      {
        label: "App Store",
        href: "https://apps.apple.com/us/app/banoon/id6478084887",
      },
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.wearbanoon.android",
      },
    ],
    order: 18,
    status: "published",
    featured: false,
    updatedAt,
  },
  {
    id: "work-bring-itt",
    slug: "bring-itt",
    title: "Bring itt",
    category: "client-apps",
    summary:
      "Travel-and-earn marketplace in React Native: buyers order from abroad, travellers bring the item and get paid.",
    role: "GenAI engineer — client delivery",
    company: "Code Avenue",
    period: "2020",
    stack: ["React Native"],
    highlights: [
      "First version of the buyer and traveller marketplace",
      "International orders in days instead of long shipping waits",
      "Live on Google Play",
    ],
    body: `Bring itt connects buyers with travellers. Someone orders a product from abroad; a traveller already coming from that country brings it, and gets paid for the errand.

I did the first version of the app in React Native. Buyers get the thing in days instead of waiting through a long international shipment, and travellers offset the cost of the trip.

It went on to 5,000+ installs on Google Play.`,
    coverUrl: "/projects/bring-itt/cover.webp",
    links: [
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.traer",
      },
    ],
    order: 22,
    status: "published",
    featured: false,
    updatedAt,
  },
  {
    id: "work-emdee",
    slug: "emdee",
    title: "Emdee Healthcare",
    category: "client-apps",
    summary:
      "US telehealth app for booking nearby doctors and joining video consultations, with Twilio calls and full RTL support.",
    role: "GenAI engineer — client delivery",
    company: "Cubix",
    period: "2021–2023",
    stack: ["Ionic React", "Twilio", "i18n"],
    highlights: [
      "Appointment booking for patients and doctors",
      "Video consultations on Twilio",
      "Internationalisation including right-to-left layout",
    ],
    body: `Emdee is a US telehealth app. Patients find a doctor nearby, see when they are free, book a slot, and join a video call. Doctors can start a follow-up with their own patients too.

I built the app in Ionic React. Appointment scheduling, video calls on Twilio, and full internationalisation including right-to-left layout across the whole app.

The point was a consultation that works in more than one language and writing direction, not only English left-to-right.

I also built the admin panel the team uses to run the platform day to day, in React.`,
    coverUrl: "/projects/emdee/cover.webp",
    order: 20,
    status: "published",
    featured: false,
    updatedAt,
  },
  {
    id: "work-lions-clubs-connect",
    slug: "lions-clubs-connect",
    title: "Lions Clubs Connect",
    category: "client-apps",
    summary:
      "Members app for Lions District 318A in India: directory, notices, donors, chat, and dues in one React Native app.",
    role: "GenAI engineer — client delivery",
    company: "Freelance",
    period: "2020",
    stack: ["React Native"],
    highlights: [
      "Directory, notices, and club services in one place",
      "Blood donor list, business corner, and online dues",
      "Live on both stores, 10,000+ installs on Google Play",
    ],
    body: `Lions Clubs Connect puts District 318A in India on one phone: around 4,400 members across about 143 clubs.

I built the members app in React Native. Directory, notices, birthdays and anniversaries, a blood donor list, a business corner, plus service activities, photos, profile badges, chat, and paying district dues online.

It is on both stores. Google Play is at 10,000+ installs.`,
    coverUrl: "/projects/lions-clubs-connect/cover.webp",
    links: [
      {
        label: "App Store",
        href: "https://apps.apple.com/us/app/lions-clubs-connect/id6462965763",
      },
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.sparkitlionsclubsconnect.f12",
      },
    ],
    order: 25,
    status: "published",
    featured: false,
    updatedAt,
  },
  {
    id: "work-savesor",
    slug: "savesor",
    title: "Savesor Smart Hotel Rooms",
    category: "client-apps",
    summary:
      "Android IoT app that commissions in-room devices over Bluetooth and TCP/UDP so a hotel room can be controlled from a phone.",
    role: "GenAI engineer — client delivery",
    company: "Freelance",
    period: "2022",
    stack: ["Android", "Java", "React Native", "IoT", "Bluetooth"],
    highlights: [
      "Device commissioning wizard for in-room hardware",
      "Bluetooth (Espressif BluFi) plus TCP/UDP control",
      "Occupancy-aware room control from a phone",
    ],
    body: `Savesor makes in-room devices for hotels and short stays. They notice whether a room is occupied and can drive things like air conditioning, which cuts energy use, and they let housekeeping skip empty-room knock routines.

I worked on the Android app, mostly the IoT side: talking to the in-room devices over Bluetooth (Espressif BluFi) and TCP/UDP, and the setup wizard used to commission each unit.

Once a device is commissioned, the room can be controlled from a phone instead of a panel on the wall.`,
    coverUrl: "/projects/savesor/cover.webp",
    links: [
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.savesor.tech",
      },
    ],
    order: 26,
    status: "published",
    featured: false,
    updatedAt,
  },
  {
    id: "work-tecobi",
    slug: "tecobi",
    title: "Tecobi",
    category: "client-apps",
    summary:
      "SMS and customer messaging app for car dealerships, so staff can run conversations and inventory questions from their phones.",
    role: "GenAI engineer — client delivery",
    company: "Freelance",
    period: "2020",
    stack: ["React Native"],
    highlights: [
      "Dealership SMS threads on iOS and Android",
      "Inventory questions without going back to a desktop",
      "Live on both stores, 5,000+ installs on Android",
    ],
    body: `TECOBI is a messaging platform for car dealerships. Staff handle SMS threads with customers: questions, promotions, and follow-ups on leads.

I built the mobile app in React Native so people on the floor can text from their phones, keep those threads in one place, and answer inventory questions without going back to a desktop.

It is on the App Store and Google Play, with 5,000+ installs on Android.`,
    coverUrl: "/projects/tecobi/cover.webp",
    links: [
      {
        label: "App Store",
        href: "https://apps.apple.com/us/app/tecobi-app/id1489353849",
      },
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.tecobi.tecobiapp",
      },
    ],
    order: 27,
    status: "published",
    featured: false,
    updatedAt,
  },
  {
    id: "work-shopscope",
    slug: "shopscope",
    title: "ShopScope",
    category: "products",
    summary:
      "Swipe-based shopping app with an AI feed, wishlists, and checkout at the retailer's own cart — mobile app, Shopify backend, and web admin.",
    role: "GenAI engineer",
    company: "ShopScope",
    period: "2024–2026",
    stack: ["React Native", "Shopify"],
    highlights: [
      "Full product: app, Shopify backend, and web admin",
      "Swipe feed that refines as you save or skip",
      "Multi-brand wishlist and in-app retailer checkout",
    ],
    body: `ShopScope is a swipe-based shopping app. It learns what you like and surfaces fashion from Australian and international brands. Save a wishlist, check out at the retailer's own checkout, and shop more than one brand in a session.

I built the full product: the React Native app, the Shopify-connected backend, and the web admin.

It is live at shopscope.app and on the App Store.`,
    coverUrl: "/projects/shopscope/cover.webp",
    links: [
      { label: "Live", href: "https://www.shopscope.app/" },
      {
        label: "App Store",
        href: "https://apps.apple.com/us/app/shopscope/id6499134678",
      },
    ],
    order: 7,
    status: "published",
    featured: false,
    updatedAt,
  },
  {
    id: "work-coachendo",
    slug: "coachendo",
    title: "Coachendo",
    category: "ai-systems",
    summary:
      "AI career-coaching app from Sweden: GraphQL on the client, store releases, and automated CI so builds reached testers and the stores.",
    role: "GenAI engineer",
    company: "Coachendo",
    period: "2021–2022",
    stack: ["React Native", "GraphQL", "GitHub Actions"],
    highlights: [
      "Frontend on the mobile app, including GraphQL",
      "Published to Google Play and the App Store",
      "CI/CD so testers and stores got builds automatically",
    ],
    body: `Coachendo is an AI career coach from Sweden. It combines the product with human coaches so companies can give teams a personal development plan.

I was the frontend engineer on the mobile app: UI from the designs, GraphQL on the client, and the store releases. I also set up GitHub Actions so builds reached testers and the stores without a manual ritual.

The team was spread across countries. The app is React Native.`,
    coverUrl: "/projects/coachendo/cover.webp",
    links: [
      { label: "The Hub", href: "https://thehub.io/startups/urkip" },
    ],
    order: 9,
    status: "published",
    featured: false,
    updatedAt,
  },
  {
    id: "work-boon-and-bliss",
    slug: "boon-and-bliss",
    title: "Boon & Bliss",
    category: "products",
    summary:
      "Group-gifting app: friends chip in on a dream gift for a birthday, wedding, or any other occasion.",
    role: "GenAI engineer",
    company: "Boon & Bliss",
    period: "2023",
    stack: ["React Native"],
    highlights: [
      "Event-based group gifting in React Native",
      "Invite friends, collect contributions, change the gift",
      "Shipped on the App Store and Google Play",
    ],
    body: `Boon & Bliss was a group-gifting app from the Netherlands. Friends chip in on a dream gift for a birthday, wedding, or any other occasion, instead of guessing at socks.

I built the React Native app: create a dream, invite people, collect contributions, and let the receiver change the gift if they want.

The product has since shut down. The stores no longer list it.`,
    coverUrl: "/projects/boon-and-bliss/cover.webp",
    order: 10,
    status: "published",
    featured: false,
    updatedAt,
  },
  {
    id: "work-tickfilm",
    slug: "tickfilm",
    title: "TickFilm",
    category: "products",
    summary:
      "Social app for movie lovers: Ticklists, recommendations, chat, and a library of more than a million trailers.",
    role: "GenAI engineer",
    company: "Code Avenue",
    period: "2020–2021",
    stack: ["React Native"],
    highlights: [
      "Watchlists, sharing, and in-app chat",
      "Library of more than a million trailers",
      "Shipped on the App Store and Google Play",
    ],
    body: `TickFilm was a social app for people who watch a lot of films. You could build Ticklists, share recommendations, chat, and browse a library of more than a million trailers.

I built it in React Native at Code Avenue: watchlists, sharing, and the social pieces the product needed.

The store listings are gone now. The work was a full consumer app, not a prototype.`,
    coverUrl: "/projects/tickfilm/cover.webp",
    order: 11,
    status: "published",
    featured: false,
    updatedAt,
  },
  {
    id: "work-high-end-crypto-demo",
    slug: "high-end-crypto-demo",
    title: "High-End Crypto Demo",
    category: "products",
    summary:
      "Crypto demo with live market data, candlestick and line charts, filters, and smooth motion.",
    role: "GenAI engineer",
    company: "BurjX",
    period: "2025–2026",
    stack: ["React Native", "Victory", "Reanimated"],
    highlights: [
      "Live market data with candlestick and line charts",
      "Interactive filters and Reanimated motion",
      "Biometric unlock on real devices",
    ],
    body: `A crypto demo with live market data, candlestick and line charts, interactive filters, and motion that stays smooth.

I built it in React Native with Victory Native, Reanimated, and Skia, including biometric unlock on real devices.`,
    coverUrl: "/projects/high-end-crypto-demo/cover.webp",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/HunainHumail/BurjXDemo",
      },
    ],
    order: 12,
    status: "published",
    featured: false,
    updatedAt,
  },
  {
    id: "work-omanoil",
    slug: "omanoil",
    title: "OmanOil",
    category: "client-apps",
    summary:
      "Fuel and loyalty app for Oman Oil Marketing Company, with NFC payments, BLE promotions, and hundreds of thousands of daily users.",
    role: "GenAI engineer — client delivery",
    company: "Cubix",
    period: "2021–2023",
    stack: ["React Native", "Redux", "NFC", "BLE", "Twilio"],
    highlights: [
      "Main developer on the live OmanOil app",
      "NFC payments and BLE beacon promotions",
      "Basma Plus cards, top-ups, loyalty, and station finder",
    ],
    body: `OmanOil is the official app for Oman Oil Marketing Company. Drivers in Oman use it for Basma Plus fuel cards, top-ups, loyalty, e-vouchers, station finding, and reviews.

I was the main developer at Cubix. I kept the live app moving and added NFC payments, BLE beacon promotions, and Twilio where the product needed it. The app sees 500k+ daily users.

It is on the App Store and Google Play.`,
    coverUrl: "/projects/omanoil/cover.webp",
    links: [
      {
        label: "App Store",
        href: "https://apps.apple.com/si/app/omanoil/id1473560939",
      },
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.oomcoapp",
      },
    ],
    order: 15,
    status: "published",
    featured: false,
    updatedAt,
  },
  {
    id: "work-royal-gas",
    slug: "royal-gas",
    title: "Royal Gas",
    category: "client-apps",
    summary:
      "Official customer app for Royal Development Gas Works in Abu Dhabi: accounts, bills, payments, and meter readings.",
    role: "GenAI engineer — client delivery",
    company: "Royal Gas",
    period: "2025",
    stack: ["React Native"],
    highlights: [
      "Account, bills, and payment history in one app",
      "Meter readings submitted from the phone",
      "Live on the App Store and Google Play",
    ],
    body: `Royal Gas is the official customer app for Royal Development Gas Works in Abu Dhabi. People manage their account, check bills, pay, and send meter readings from the phone.

I built the React Native app so customers can read company info, reach support, and handle their own account without a call.

It is on the App Store and Google Play.`,
    coverUrl: "/projects/royal-gas/cover.webp",
    links: [
      {
        label: "App Store",
        href: "https://apps.apple.com/ae/app/royalgas/id1193057561",
      },
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.royalgas",
      },
    ],
    order: 16,
    status: "published",
    featured: false,
    updatedAt,
  },
  {
    id: "work-mh1",
    slug: "mh1",
    title: "MH1",
    category: "client-apps",
    summary:
      "Interactive hockey training app from Maddie Hinch, with profiles, a feed, and a goalkeeper skills library.",
    role: "GenAI engineer — client delivery",
    company: "Code Avenue",
    period: "2020–2021",
    stack: ["React Native"],
    highlights: [
      "Profiles, home feed, and discussions",
      "Goalkeeper skills library with close-ups and split-screen",
      "React Native app plus the admin web",
    ],
    body: `MH1 is an interactive hockey training app from Olympic goalkeeper Maddie Hinch. Athletes, coaches, and parents get profiles, a home feed, discussions, and a goalkeeper skills library with close-ups, step-by-step walkthroughs, and split-screen analysis.

I built the React Native app at Code Avenue, plus the admin web used to run it.

The stores have since taken the listings down.`,
    coverUrl: "/projects/mh1/cover.webp",
    order: 19,
    status: "published",
    featured: false,
    updatedAt,
  },
  {
    id: "work-innerspark",
    slug: "innerspark",
    title: "InnerSpark",
    category: "client-apps",
    summary:
      "Daily companion from a UK client: affirmations, meditations, and relaxation exercises.",
    role: "GenAI engineer — client delivery",
    company: "Upwork",
    period: "2025",
    stack: ["React Native", "TypeScript", "Firebase"],
    highlights: [
      "Affirmations, meditations, and relaxation exercises",
      "Firebase auth and messaging",
      "Google, Apple, and Facebook sign-in",
    ],
    body: `InnerSpark is a daily companion app from a UK Upwork client: positive affirmations, meditations, and relaxation exercises.

I built the React Native app with TypeScript, Redux Toolkit, and Firebase for auth and messaging, plus Google, Apple, and Facebook sign-in.

The Play listing is no longer up.`,
    coverUrl: "/projects/innerspark/cover.webp",
    order: 21,
    status: "published",
    featured: false,
    updatedAt,
  },
  {
    id: "work-golflinks",
    slug: "golflinks",
    title: "Golflinks",
    category: "client-apps",
    summary:
      "Golfer app from Code Avenue: profiles, round scheduling, Google Maps tracking, and chat.",
    role: "GenAI engineer — client delivery",
    company: "Code Avenue",
    period: "2020",
    stack: ["React Native", "Google Maps"],
    highlights: [
      "Player profiles and home components",
      "Calendar scheduling and Google Maps tracking",
      "In-app chat",
    ],
    body: `Golflinks is an app for finding other golfers nearby. Profiles, round scheduling, Google Maps tracking, and chat.

I built those pieces in React Native during my time at Code Avenue.`,
    coverUrl: "/projects/golflinks/cover.webp",
    order: 23,
    status: "published",
    featured: false,
    updatedAt,
  },
  {
    id: "work-grocery",
    slug: "grocery",
    title: "Grocery App",
    category: "client-apps",
    summary:
      "Marketplace for healthy and organic food, from meat and fish to fruit, vegetables, and spices, with a quick checkout.",
    role: "GenAI engineer — client delivery",
    stack: ["React Native", "TypeScript"],
    highlights: [
      "Browse meat, fish, fruit, vegetables, and spices",
      "Simple browsing and a quick checkout",
      "React Native and TypeScript",
    ],
    body: `A grocery marketplace for healthy and organic food — meat, fish, fruit, vegetables, and spices — with simple browsing and a quick checkout.

I built the app in React Native and TypeScript.`,
    coverUrl: "/projects/grocery/cover.webp",
    order: 24,
    status: "published",
    featured: false,
    updatedAt,
  },
  {
    id: "work-freelance-android",
    slug: "freelance-android",
    title: "Freelance Android",
    category: "client-apps",
    summary:
      "Native Android work in Java for Freelancer.com clients, from 2017 to 2020.",
    role: "GenAI engineer — client delivery",
    company: "Freelancer.com",
    period: "2017–2020",
    stack: ["Java", "Android"],
    highlights: [
      "Native Android apps in Java",
      "Client work across a three-year stretch",
      "Shipped features and builds onto phones",
    ],
    body: `From 2017 to 2020 I took native Android work on Freelancer.com. The jobs were Java apps for clients: shipping features, talking to APIs, and getting builds onto phones.

That stretch is how I started shipping mobile software for real clients, before React Native and the later product work.`,
    coverUrl: "/projects/freelance-android/cover.webp",
    order: 28,
    status: "published",
    featured: false,
    updatedAt,
  },
  {
    id: "work-purevpn",
    slug: "purevpn",
    title: "PureVPN",
    category: "products",
    summary:
      "Cross-platform React Native VPN SDK for Android, iOS, Windows, and macOS, built at Disrupt / PureSquare.",
    role: "GenAI engineer",
    company: "Disrupt / PureSquare",
    period: "2023–2025",
    stack: ["React Native", "Swift", "Kotlin", "Redux", "Node.js"],
    highlights: [
      "Senior then Lead on the React Native VPN SDK",
      "Shared business-logic module for native and React Native",
      "Android, iOS, Windows, and macOS from one core",
    ],
    body: `I spent February 2023 to August 2025 at Disrupt / PureSquare in the cybersecurity team, first as a senior engineer and then as lead.

The work was a cross-platform VPN SDK for Android, iOS, Windows, and macOS. Native bridges in Swift and Kotlin sit under a shared business-logic module that React Native apps call into. Redux and Node.js cover the shared app layer.

I also built VPN apps on that SDK. One core, instead of a new networking stack for every brand.`,
    coverUrl: "/projects/purevpn/cover.webp",
    order: 29,
    status: "published",
    featured: false,
    updatedAt,
  },
];

export const workSeed: WorkItem[] = workItems.slice().sort((a, b) => a.order - b.order);

