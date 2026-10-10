/* REFERENCES DATA — the ONE place where sources are stored.
   ---------------------------------------------------------------------------
   Plain classic script (no modules, no fetch) so it also works when the page is
   opened straight from a file.

   HOW IT WORKS
   - "sources" holds each source ONCE: author, date, title, URL (plus a series number if the
     source shows one).
   - "sections" lists the project sections (in Atlas order). Each section lists the ids of
     the sources it uses.
   - The page sorts every section alphabetically by author, builds the APA 7 reference,
     and makes the URL clickable. Do not type the reference by hand.
   - If one source is used by several sections, it appears in full under the first
     section that uses it; the other sections show a short "see also" link (no duplicate).

   HOW TO ADD A SOURCE
   1. Add it to "sources" (new unique id). Fill ONLY what the source really shows.
      No date shown -> leave "date" out (or date: "n.d.")
   2. Add { id: "..." } to the "sources" array of the right section below.
   Never guess an author, date, DOI or URL. */

window.ATLAS_REFERENCES = {

  // false = only sections that already have verified sources are shown on the page.
  // true  = every section is shown (empty ones display "No verified sources yet").
  showEmptySections: false,

  sources: {

    "mcdonalds-corp-history": {
      author: "McDonald’s Corporation",
      title: "Our History",
      url: "https://corporate.mcdonalds.com/corpmcd/our-company/who-we-are/our-history.html"
    },

    "mcdonalds-ph-story": {
      author: "McDonald’s Philippines",
      title: "Our Story",
      url: "https://www.mcdonalds.com.ph/our-story"
    },

    "uniqlo-ph-information": {
      author: "UNIQLO Philippines",
      title: "Information",
      url: "https://www.uniqlo.com/ph/en/information"
    },

    "fastretailing-southeast-asia": {
      author: "Fast Retailing",
      title: "Southeast Asia",
      url: "https://www.fastretailing.com/eng/group/strategy/southeastasia.html"
    },

    "sanchez-korean-turn": {
      author: "Louie Jon A. Sánchez",
      title: "“The ‘Korean Turn’ in Philippine Popular Culture”",
      url: "https://doi.org/10.22801/svn.2024.16.1.15"
    },

    "worldbank-digital-ph": {
      author: "World Bank",
      title: "Digital Transformation in the Philippines",
      url: "https://www.worldbank.org/en/news/press-release/2024/11/12/world-bank-helps-boost-digital-transformation-in-ph"
    },

    "dmw-top10-destinations": {
      author: "Department of Migrant Workers",
      title: "Deployed Land-based Overseas Filipino Workers by Top 10 Destinations, 2024 vs. 2025",
      url: "https://dmw.gov.ph/archives/v1/resources/dsms/DMW/Externals/2025/Statistics/2024%20vs%202025/TAB%207%20-%20Deployed%20Landbased%20Overseas%20Filipino%20Workers%20by%20Top%2010%20Destinations_Total,%20New%20Hires%20&%20Rehires%20(2024%20vs%202025).pdf"
    },

    "bsp-ofw-remittances": {
      author: "Bangko Sentral ng Pilipinas",
      title: "OFW Remittances",
      url: "https://www.bsp.gov.ph/statistics/external/ofw.aspx"
    },

    "wits-2024-cocoa-exports-malaysia": {
      author: "World Bank WITS",
      title: "Cocoa bean exports to Malaysia, 2024",
      url: "https://wits.worldbank.org/trade/comtrade/en/country/All/year/2024/tradeflow/Exports/partner/MYS/product/180100"
    },

    "wits-2024-philippines-imports": {
      author: "World Bank WITS",
      title: "Philippines’ imports of cocoa-containing products, 2024",
      url: "https://wits.worldbank.org/trade/comtrade/en/country/PHL/year/2024/tradeflow/Imports/partner/ALL/product/1806"
    },

    "mcb-statistics": {
      author: "Malaysian Cocoa Board",
      title: "Statistics",
      url: "https://www.koko.gov.my/doc/en/statistics/"
    },

    "icco-trading-shipping": {
      author: "International Cocoa Organization",
      title: "Trading and Shipping",
      url: "https://www.icco.org/trading-shipping/"
    },

    "dol-cocoa-child-labor": {
      author: "U.S. Department of Labor",
      title: "Cocoa child labor",
      url: "https://www.dol.gov/newsroom/releases/ilab/ilab20241127"
    },

    "dimattia-2017-processing": {
      author: "Di Mattia et al.",
      date: "2017",
      title: "Chocolate processing",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5626833/"
    },

    "icco-2024-august-statistics": {
      author: "International Cocoa Organization",
      title: "August 2024 cocoa statistics",
      url: "https://www.icco.org/august-2024-quarterly-bulletin-of-cocoa-statistics/"
    },

    "abscbn-2023-vietnam": {
      author: "ABS-CBN News",
      date: "2023, July 3",
      title: "Jollibee says it now has 158 stores in Vietnam",
      url: "https://www.abs-cbn.com/business/07/03/23/jollibee-says-it-now-has-158-stores-in-vietnam"
    },

    "jollibee-la-beverly": {
      author: "Jollibee",
      date: "n.d.",
      title: "Jollibee - Fried Chicken, Burgers & Pies - 3821 Beverly Blvd",
      url: "https://locations.jollibeefoods.com/usa/ca/los-angeles/3821-beverly-blvd"
    },

    "jollibee-mississauga-boyer": {
      author: "Jollibee",
      date: "n.d.",
      title: "Jollibee - Fried Chicken, Burgers & Pies - 800 Boyer Blvd",
      url: "https://locations.jollibeefoods.com/ca/on/mississauga/800-boyer-blvd"
    },

    "imf-2002-framework": {
      author: "International Monetary Fund",   // corporate author (page says "By IMF Staff")
      date: "2002, March",                      // shown on the source page
      title: "Globalization: A framework for IMF involvement",
      descriptor: "(Issues Brief 02/01)",       // report/series number shown on the source
      url: "https://www.imf.org/external/np/exr/ib/2002/031502.htm"
    },

    "jollibee-2021-expansion": {
      author: "Jollibee Group",
      date: "2021, October 5",                  // dateline: MANILA, Philippines. 5 October 2021
      // Title as printed on the page (note the comma before "and Asia").
      title: "Jollibee Group continues expansion across Europe, Middle East, and Asia with 11 new stores",
      url: "https://www.jollibeegroup.com/news/jollibee-group-continues-expansion-across-europe-middle-east-and-asia-with-11-new-stores/"
    },

    "worldbank-2020-wdr": {
      author: "World Bank",
      date: "2020",
      title: "World development report 2020: Trading for development in the age of global value chains",
      url: "https://www.worldbank.org/en/publication/wdr2020"
    },

    "wto-what-is-the-wto": {
      author: "World Trade Organization",
      date: "n.d.",                             // no publication date shown on the page
      title: "What is the WTO?",
      url: "https://www.wto.org/english/thewto_e/whatis_e/whatis_e.htm"
    },

    // ---- Globalization and the Philippines (all four verified on the linked PIDS PDFs/pages) ----
    // Note: pids-2014-23-pdf and pids-2014-23-page are the SAME paper (PIDS DP 2014-23),
    // listed twice because two different URLs were requested. Dates follow each linked page.
    "pids-2014-23-pdf": {
      author: "Philippine Institute for Development Studies (PIDS)",
      date: "2014, April",                      // cover of the PDF: "April 2014"
      title: "Small Farmers in High Value Chains: Binding or Relaxing Constraints to Inclusive Growth?",
      descriptor: "(PIDS Discussion Paper Series No. 2014-23)",
      url: "https://pidswebs.pids.gov.ph/CDN/PUBLICATIONS/pidsdps1423.pdf"
    },

    "pids-2014-23-page": {
      author: "Philippine Institute for Development Studies (PIDS)",
      date: "2014, April 29",                   // publication page: "Apr 29, 2014"
      title: "Small Farmers in High Value Chains: Binding or Relaxing Constraints to Inclusive Growth?",
      descriptor: "(PIDS Discussion Paper Series No. 2014-23)",
      url: "https://www.pids.gov.ph/publication/discussion-papers/small-farmers-in-high-value-chains-binding-or-relaxing-constraints-to-inclusive-growth"
    },

    "pids-2021-38-pdf": {
      author: "Philippine Institute for Development Studies (PIDS)",
      date: "2021, December",                   // cover of the PDF: "December 2021"
      title: "Analyzing Filipino Migrant Workers’ Access to Social Protection",
      descriptor: "(PIDS Discussion Paper Series No. 2021-38)",
      url: "https://pidswebs.pids.gov.ph/CDN/PUBLICATIONS/pidsdps2138.pdf"
    },

    "pids-2023-17-page": {
      author: "Philippine Institute for Development Studies (PIDS)",
      date: "2023, December 14",                // publication page: "Dec 14, 2023"
      title: "Long-Term Effects of Labor Migration in the Philippines: “Napakasakit, Kuya Eddie!”",
      descriptor: "(PIDS Discussion Paper Series No. 2023-17)",
      url: "https://pids.gov.ph/publication/discussion-papers/long-term-effects-of-labor-migration-in-the-philippines-napakasakit-kuya-eddie"
    },

    "worldbank-2025-internet-connectivity": {
      author: "World Bank",
      date: "2025, July 2",
      title: "Unlocking the Philippines’ Digital Transformation by Increasing Internet Connectivity",
      url: "https://www.worldbank.org/en/results/2025/07/02/unlocking-the-philippines-digital-transformation-by-increasing-internet-connectivity"
    },

    // ---- Culture Goes Global (dates read from each linked page) ----
    "oup-2021-rise-of-kpop": {
      author: "Oxford Academic",
      date: "2021, February 10",                // chapter page: 2021/2/10
      title: "The Rise and Rise of K-Pop: A Pocket History",
      url: "https://academic.oup.com/edited-volume/34725/chapter-abstract/296485624"
    },

    "oup-2015-korean-wave-dramas": {
      author: "Oxford Academic",
      date: "2015, December 3",                 // chapter page: 2015/12/03
      title: "The Korean Wave and Korean Dramas",
      url: "https://academic.oup.com/edited-volume/61798/chapter/546180877"
    },

    "kcc-2023-everyones-kpop-manila": {
      author: "Korean Cultural Center",
      date: "2023, July 3",                     // posted 2023.07.03
      title: "Everyone’s K-Pop: Manila",
      url: "https://www.korean-culture.org/kocc/view.do?seq=1045330&menucode=menu0023&langCode=lang001&searchType=menu0023"
    },

    "sanchez-2024-korean-turn-kci": {
      author: "Louie Jon A. Sánchez",
      date: "2024",                             // SUVANNABHUMI vol. 16, no. 1 (2024)
      title: "The “Korean Turn” in Philippine Popular Culture",
      url: "https://journal.kci.go.kr/svn/archive/articleView?artiId=ART003048391"
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
        { id: "wto-what-is-the-wto" },
        { id: "imf-2002-framework" },
        { id: "jollibee-2021-expansion" },
        { id: "worldbank-2020-wdr" },
        { id: "abscbn-2023-vietnam" },
        { id: "jollibee-la-beverly" },
        { id: "jollibee-mississauga-boyer" }
      ]
    },
    {
      id: "follow-the-connection",
      title: "Follow the Connection",
      short: "Follow the Connection",
      sources: [
        { id: "wits-2024-cocoa-exports-malaysia" },
        { id: "wits-2024-philippines-imports" },
        { id: "mcb-statistics" },
        { id: "icco-trading-shipping" },
        { id: "dol-cocoa-child-labor" },
        { id: "dimattia-2017-processing" },
        { id: "icco-2024-august-statistics" }
      ]
    },
    {
      id: "globalization-in-everyday-filipino-life",
      title: "Globalization in Everyday Filipino Life",
      short: "Everyday Filipino Life",
      sources: [
        { id: "mcdonalds-corp-history" },
        { id: "mcdonalds-ph-story" },
        { id: "uniqlo-ph-information" },
        { id: "fastretailing-southeast-asia" },
        { id: "sanchez-korean-turn" },
        { id: "worldbank-digital-ph" },
        { id: "dmw-top10-destinations" },
        { id: "bsp-ofw-remittances" }
      ]
    },
    {
      id: "globalization-and-the-philippines",
      title: "Globalization and the Philippines",
      short: "The Philippines",
      sources: [
        { id: "pids-2014-23-pdf" },
        { id: "pids-2014-23-page" },
        { id: "pids-2021-38-pdf" },
        { id: "pids-2023-17-page" },
        { id: "worldbank-2025-internet-connectivity" }
      ]
    },
    {
      id: "culture-goes-global",
      title: "Culture Goes Global",
      short: "Culture Goes Global",
      sources: [
        { id: "oup-2021-rise-of-kpop" },
        { id: "oup-2015-korean-wave-dramas" },
        { id: "kcc-2023-everyones-kpop-manila" },
        { id: "sanchez-2024-korean-turn-kci" }
      ]
    },
    { id: "benefits-and-challenges",                  title: "Benefits and Challenges",                  short: "Benefits & Challenges",     sources: [] },
    { id: "global-problem-global-response",           title: "Global Problem / Global Response",         short: "Problem / Response",        sources: [] },
    { id: "my-globalization-map",                     title: "My Globalization Map",                     short: "My Map",                    sources: [] }
  ]
};
