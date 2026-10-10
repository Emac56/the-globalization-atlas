/* REFERENCES DATA — the ONE place where sources are stored.
   ---------------------------------------------------------------------------
   Plain classic script (no modules, no fetch) so it also works when the page is
   opened straight from a file.

   HOW IT WORKS
   - "sources" holds each source ONCE, with the pieces needed for an APA 7 reference.
   - "sections" lists the project sections (in Atlas order). Each section lists the
     sources it uses, and what each source is used for in THAT section.
   - The page sorts every section alphabetically by author, builds the APA 7 reference,
     and makes the URL clickable. Do not type the reference by hand.
   - If one source is used by several sections, it appears in full under the first
     section that uses it; the other sections show a short "see also" link (no duplicate).

   HOW TO ADD A SOURCE
   1. Add it to "sources" (new unique id). Fill ONLY what the source really shows.
      No date shown -> date: "n.d." (and add retrieved: "Month Day, Year").
   2. Add { id, usedFor, limits } to the "sources" array of the right section below.
   Never guess an author, date, DOI or URL. */

window.ATLAS_REFERENCES = {

  // false = only sections that already have verified sources are shown on the page.
  // true  = every section is shown (empty ones display "No verified sources yet").
  showEmptySections: false,

  sources: {

    "imf-2002-framework": {
      type: "International organization",
      author: "International Monetary Fund",   // corporate author (page says "By IMF Staff")
      date: "2002, March",                      // shown on the source page
      title: "Globalization: A framework for IMF involvement",
      descriptor: "(Issues Brief 02/01)",       // report/series number shown on the source
      url: "https://www.imf.org/external/np/exr/ib/2002/031502.htm"
    },

    "jollibee-2021-expansion": {
      type: "Company news",
      author: "Jollibee Group",
      date: "2021, October 5",                  // dateline: MANILA, Philippines. 5 October 2021
      // Title as printed on the page (note the comma before "and Asia").
      title: "Jollibee Group continues expansion across Europe, Middle East, and Asia with 11 new stores",
      url: "https://www.jollibeegroup.com/news/jollibee-group-continues-expansion-across-europe-middle-east-and-asia-with-11-new-stores/"
      // TO CONFIRM: the page is not labelled "press release". If your teacher wants it,
      // add descriptor: "[Press release]" here.
    },

    "worldbank-2020-wdr": {
      type: "International organization",
      author: "World Bank",
      date: "2020",
      title: "World development report 2020: Trading for development in the age of global value chains",
      url: "https://www.worldbank.org/en/publication/wdr2020",
      // Verified on the World Bank Open Knowledge Repository record (shown in the details panel).
      doi: "https://doi.org/10.1596/978-1-4648-1457-0"
    },

    "wto-what-is-the-wto": {
      type: "International organization",
      author: "World Trade Organization",
      date: "n.d.",                             // no publication date shown on the page
      title: "What is the WTO?",
      retrieved: "October 10, 2026",            // TO CONFIRM: set to the date YOU open the page
      url: "https://www.wto.org/english/thewto_e/whatis_e/whatis_e.htm"
    }
  },

  // Order here = Atlas order. Sections without sources stay empty on purpose:
  // they are organizing categories only, not placeholders for invented references.
  sections: [
    {
      id: "what-is-globalization",
     
      title: "What is Globalization?",
      short: "What is Globalization?",
      sources: [
        {
          id: "wto-what-is-the-wto",
          usedFor: "Global Trade: describes the WTO as the global organization that deals with the rules of trade between nations and helps producers, exporters, and importers do business.",
          limits: "The copy of the page that was checked still showed 2013 figures and a former Director-General, so do not use it for current WTO facts such as budget, membership, or leadership."
        },
        {
          id: "imf-2002-framework",
          usedFor: "Definition: describes globalization as an increasingly free flow of ideas, people, goods, services, and capital that links economies and societies.",
          limits: "Written in 2002 from an economic point of view. It does not discuss digital communication directly and is not a source for current statistics."
        },
        {
          id: "jollibee-2021-expansion",
          usedFor: "Everyday example: a Philippine-based restaurant brand opening branches abroad (UK, Spain, Qatar, Saudi Arabia, Hong Kong) and serving local customers there.",
          limits: "Does not mention the United States, Canada, or Vietnam, so it cannot support anything specific about the three photo placeholders. A separate source is needed for those branches."
        },
        {
          id: "worldbank-2020-wdr",
          usedFor: "Global Trade: explains that global value chains now account for almost half of world trade, linking countries through international production and trade.",
          limits: "Focused on trade and global value chains. It is not a source for the movement of people or for digital communication."
        }
      ]
    },
    { id: "follow-the-connection",                    title: "Follow the Connection",                    short: "Follow the Connection",     sources: [] },
    { id: "globalization-in-everyday-filipino-life",  title: "Globalization in Everyday Filipino Life",  short: "Everyday Filipino Life",    sources: [] },
    { id: "globalization-and-the-philippines",        title: "Globalization and the Philippines",        short: "The Philippines",           sources: [] },
    { id: "culture-goes-global",                      title: "Culture Goes Global",                      short: "Culture Goes Global",       sources: [] },
    { id: "benefits-and-challenges",                  title: "Benefits and Challenges",                  short: "Benefits & Challenges",     sources: [] },
    { id: "global-problem-global-response",           title: "Global Problem / Global Response",         short: "Problem / Response",        sources: [] },
    { id: "my-globalization-map",                     title: "My Globalization Map",                     short: "My Map",                    sources: [] }
  ]
};
