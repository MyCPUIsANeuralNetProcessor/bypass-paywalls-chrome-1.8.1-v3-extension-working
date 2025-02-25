'use strict';

const restrictions = {
  'adweek.com': /^((?!\.adweek\.com\/(.+\/)?(amp|agencyspy|tvnewser|tvspy)\/).)*$/,
  'barrons.com': /.+\.barrons\.com\/(amp\/)?article(s)?\/.+/,
  'economist.com': /.+economist\.com\/.+\/\d{1,4}\/\d{1,2}\/\d{2}\/.+/,
  'seekingalpha.com': /.+seekingalpha\.com\/article\/.+/,
  'techinasia.com': /\.techinasia\.com\/.+/,
  'ft.com': /.+\.ft.com\/content\//
};

// Don't remove cookies before page load
const allowCookies = [
  'ad.nl',
  'bd.nl',
  'bndestem.nl',
  'brisbanetimes.com.au',
  'canberratimes.com.au',
  'cen.acs.org',
  'demorgen.be',
  'denverpost.com',
  'destentor.nl',
  'ed.nl',
  'examiner.com.au',
  'gelocal.it',
  'gelderlander.nl',
  'grubstreet.com',
  'harpers.org',
  'hbr.org',
  'humo.be',
  'lesechos.fr',
  'lrb.co.uk',
  'medium.com',
  'mercurynews.com',
  'newstatesman.com',
  'nrc.nl',
  'nymag.com',
  'ocregister.com',
  'parool.nl',
  'pzc.nl',
  'qz.com',
  'scientificamerican.com',
  'seattletimes.com',
  'seekingalpha.com',
  'sofrep.com',
  'spectator.co.uk',
  'speld.nl',
  'tubantia.nl',
  'techinasia.com',
  'telegraaf.nl',
  'the-american-interest.com',
  'theadvocate.com.au',
  'theage.com.au',
  'theatlantic.com',
  'theaustralian.com.au',
  'thecut.com',
  'thediplomat.com',
  'themercury.com.au',
  'towardsdatascience.com',
  'trouw.nl',
  'vn.nl',
  'volkskrant.nl',
  'vulture.com',
  'nzz.ch',
  'thehindu.com',
  'financialpost.com',
  'haaretz.co.il',
  'haaretz.com',
  'themarker.com',
  'sueddeutsche.de',
  'gelocal.it',
  'elmundo.es',
  'time.com',
  'zeit.de',
  'expansion.com',
  'dailytelegraph.com.au',
  'washingtonpost.com'
];

// Removes cookies after page load
const removeCookies = [
  'ad.nl',
  'bd.nl',
  'bloomberg.com',
  'bloombergquint.com',
  'bndestem.nl',
  'brisbanetimes.com.au',
  'canberratimes.com.au',
  'cen.acs.org',
  'demorgen.be',
  'denverpost.com',
  'destentor.nl',
  'ed.nl',
  'examiner.com.au',
  'gelderlander.nl',
  'globes.co.il',
  'grubstreet.com',
  'harpers.org',
  'hbr.org',
  'humo.be',
  'lesechos.fr',
  'mercurynews.com',
  'newstatesman.com',
  'nrc.nl',
  'nymag.com',
  'ocregister.com',
  'pzc.nl',
  'qz.com',
  'scientificamerican.com',
  'seattletimes.com',
  'sofrep.com',
  'spectator.co.uk',
  'speld.nl',
  'telegraaf.nl',
  'theadvocate.com.au',
  'theage.com.au',
  'theatlantic.com',
  'thecut.com',
  'thediplomat.com',
  'towardsdatascience.com',
  'tubantia.nl',
  'vn.nl',
  'vulture.com',
  'wsj.com',
  'medium.com',
  'washingtonpost.com',
  'japantimes.co.jp'
];

// Contains remove cookie sites above plus any custom sites
let _removeCookies = removeCookies;

// select specific cookie(s) to hold from removeCookies domains
const removeCookiesSelectHold = {
  'qz.com': ['gdpr'],
  'wsj.com': ['wsjregion'],
  'seattletimes.com': ['st_newsletter_splash_seen']
};

// select only specific cookie(s) to drop from removeCookies domains
const removeCookiesSelectDrop = {
  'ad.nl': ['temptationTrackingId'],
  'ambito.com': ['TDNotesRead'],
  'bd.nl': ['temptationTrackingId'],
  'bndestem.nl': ['temptationTrackingId'],
  'demorgen.be': ['TID_ID'],
  'destentor.nl': ['temptationTrackingId'],
  'ed.nl': ['temptationTrackingId'],
  'fd.nl': ['socialread'],
  'gelderlander.nl': ['temptationTrackingId'],
  'humo.be': ['TID_ID'],
  'nrc.nl': ['counter'],
  'pzc.nl': ['temptationTrackingId'],
  'tubantia.nl': ['temptationTrackingId'],
  'speld.nl': ['speld-paywall']
};

// Override User-Agent with Googlebot
const useGoogleBotSites = [
  'adelaidenow.com.au',
  'barrons.com',
  'couriermail.com.au',
  'fd.nl',
  'genomeweb.com',
  'heraldsun.com.au',
  'lavoixdunord.fr',
  'ntnews.com.au',
  'quora.com',
  'seekingalpha.com',
  'telegraph.co.uk',
  'theaustralian.com.au',
  'themercury.com.au',
  'thenational.scot',
  'wsj.com',
  'kansascity.com',
  'republic.ru',
  'nzz.ch',
  'df.cl',
  'ft.com',
  'wired.com',
  'zeit.de'
];

// Override User-Agent with Bingbot
const useBingBot = [
  'haaretz.co.il',
  'haaretz.com',
  'themarker.com'
];

// Contains google bot sites above plus any custom sites
let _useGoogleBotSites = useGoogleBotSites;

function setDefaultOptions () {
  chrome.storage.sync.set({
    sites: defaultSites
  }, function () {
    chrome.runtime.openOptionsPage();
  });
}

// Block external scripts
const blockedRegexes = {
  'adweek.com': /.+\.lightboxcdn\.com\/.+/,
  'afr.com': /afr\.com\/assets\/vendorsReactRedux_client.+\.js/,
  'businessinsider.com': /(.+\.tinypass\.com\/.+|cdn\.onesignal\.com\/sdks\/.+\.js)/,
  'chicagotribune.com': /.+:\/\/.+\.tribdss\.com\//,
  'economist.com': /(.+\.tinypass\.com\/.+|economist\.com\/engassets\/_next\/static\/chunks\/framework.+\.js)/,
  'editorialedomani.it': /(js\.pelcro\.com\/.+|editorialedomani.it\/pelcro\.js)/,
  'foreignpolicy.com': /(cdn\.cxense\.com\/|\.tinypass\.com\/)/,
  'fortune.com': /.+\.tinypass\.com\/.+/,
  'haaretz.co.il': /haaretz\.co\.il\/htz\/js\/inter\.js/,
  'haaretz.com': /haaretz\.com\/hdc\/web\/js\/minified\/header-scripts-int.js.+/,
  'inquirer.com': /.+\.tinypass\.com\/.+/,
  'lastampa.it': /.+\.repstatic\.it\/minify\/sites\/lastampa\/.+\/config\.cache\.php\?name=social_js/,
  'lrb.co.uk': /.+\.tinypass\.com\/.+/,
  'medscape.com': /.+\.medscapestatic\.com\/.*medscape-library\.js/,
  'interest.co.nz': /(.+\.presspatron\.com.+|.+interest\.co\.nz.+pp-ablock-banner\.js)/,
  'repubblica.it': /scripts\.repubblica\.it\/pw\/pw\.js.+/,
  'spectator.co.uk': /.+\.tinypass\.com\/.+/,
  'spectator.com.au': /.+\.tinypass\.com\/.+/,
  'telegraph.co.uk': /.+telegraph\.co\.uk.+martech.+/,
  'thecourier.com.au': /.+cdn-au\.piano\.io\/api\/tinypass.+\.js/,
  'thenation.com': /thenation\.com\/.+\/paywall-script\.php/,
  'thenational.scot': /(.+\.tinypass\.com\/.+|.+thenational\.scot.+omniture\.js|.+thenational\.scot.+responsive-sync.+)/,
  'thewrap.com': /thewrap\.com\/.+\/wallkit\.js/,
  'wsj.com': /cdn\.ampproject\.org\/v\d\/amp-access-.+\.js/,
  'historyextra.com': /.+\.evolok\.net\/.+\/authorize\/.+/,
  'barrons.com': /cdn\.ampproject\.org\/v\d\/amp-access-.+\.js/,
  'irishtimes.com': /cdn\.ampproject\.org\/v\d\/amp-access-.+\.js/,
  'elmercurio.com': /(merreader\.emol\.cl\/assets\/js\/merPramV2.js|staticmer\.emol\.cl\/js\/inversiones\/PramModal.+\.js)/,
  'sloanreview.mit.edu': /(.+\.tinypass\.com\/.+|.+\.netdna-ssl\.com\/wp-content\/themes\/smr\/assets\/js\/libs\/welcome-ad\.js)/,
  'latercera.com': /.+\.cxense\.com\/+/,
  'lesechos.fr': /.+\.tinypass\.com\/.+/,
  'thehindu.com': /ajax\.cloudflare\.com\/cdn-cgi\/scripts\/.+\/cloudflare-static\/rocket-loader\.min\.js/,
  'technologyreview.com': /.+\.blueconic\.net\/.+/,
  'spectator.us': /(cdn\.cxense\.com\/.+|\.tinypass\.com\/.+)/,
  'gelocal.it': /(\.repstatic\.it\/minify\/sites\/gelocal\/.+\/config\.cache(_\d)?\.php|cdn\.ampproject\.org\/v\d\/amp-(access|ad)-.+\.js)/,
  'elmundo.es': /cdn\.ampproject\.org\/v\d\/amp-(access|ad|consent)-.+\.js/,
  'time.com': /\/time\.com\/dist\/meter-wall-client-js\..+\.js/,
  'thestar.com': /\.com\/api\/overlaydata/,
  'elpais.com': /(\.epimg\.net\/js\/.+\/(noticia|user)\.min\.js|\/elpais\.com\/arc\/subs\/p\.min\.js|cdn\.ampproject\.org\/v\d\/amp-(access|(sticky-)?ad|consent)-.+\.js)/,
  'expansion.com': /cdn\.ampproject\.org\/v\d\/amp-(access|ad|consent)-.+\.js/,
  'chicagobusiness.com': /(\.tinypass\.com\/|\.chicagobusiness\.com\/.+\/js\/js_.+\.js)/,
  'dailytelegraph.com.au': /cdn\.ampproject\.org\/v\d\/amp-(access|ad|consent)-.+\.js/,
  'theglobeandmail.com': /(\.theglobeandmail\.com\/pf\/dist\/engine\/react\.js|smartwall\.theglobeandmail\.com\/)/,
  'nytimes.com': /(meter-svc\.nytimes\.com\/meter\.js|mwcm\.nyt\.com\/.+\.js|cooking\.nytimes\.com\/api\/.+\/access)/,
  'latimes.com': /(metering\.platform\.latimes\.com\/|cdn\.ampproject\.org\/v\d\/amp-(access|subscriptions)-.+\.js)/,
  'theathletic.com': /cdn\.ampproject\.org\/v\d\/amp-(access|subscriptions)-.+\.js/,
  'japantimes.co.jp': /cdn\.cxense\.com\//,
  'scmp.com': /(\.tinypass\.com\/|cdn\.ampproject\.org\/v\d\/amp-access-.+\.js)/,
  'ilmessaggero.it': /(utils\.cedsdigital\.it\/js\/PaywallMeter\.js)/,
  'washingtonpost.com': /\.washingtonpost\.com\/tetro\/metering\/evaluate/
};

const userAgentDesktop = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
const userAgentMobile = 'Chrome/41.0.2272.96 Mobile Safari/537.36 (compatible ; Googlebot/2.1 ; +http://www.google.com/bot.html)';
const userAgentDesktopBingBot = 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)';
const userAgentMobileBingBot = 'Chrome/80.0.3987.92 Mobile Safari/537.36 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)';

let enabledSites = [];

// Get the enabled sites
chrome.storage.sync.get({
  sites: {},
  customSites: []
}, function (items) {
  enabledSites = Object.values(items.sites).concat(items.customSites);

  // Use googlebot UA for custom sites
  _useGoogleBotSites = useGoogleBotSites.concat(items.customSites);

  // Remove cookies for custom sites
  _removeCookies = removeCookies.concat(items.customSites);
});

// Listen for changes to options
chrome.storage.onChanged.addListener(function (changes, namespace) {
  if (changes.sites && changes.sites.newValue) {
    const sites = changes.sites.newValue;
    enabledSites = Object.values(sites);
  }
});

// Set and show default options on install
chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason === 'install') {
    setDefaultOptions();
  } else if (details.reason === 'update') {
    // User updated extension
  }
});

chrome.action.onClicked.addListener((tab) => {
  updateBadge(tab);
});

function updateBadge(activeTab) {
  if (!activeTab) return;
  const badgeText = getBadgeText(activeTab.url);
  chrome.action.setBadgeBackgroundColor({ color: 'blue' });
  chrome.action.setBadgeText({ text: badgeText });
}

function getBadgeText (currentUrl) {
  return currentUrl && isSiteEnabled({ url: currentUrl }) ? 'ON' : '';
}

// AMP redirect for dailytelegraph.com.au
chrome.declarativeNetRequest.updateDynamicRules({
  removeRuleIds: [3],
  addRules: [
    {
      id: 3,
      priority: 1,
      action: {
        type: 'redirect',
        redirect: {
          regexSubstitution: 'https://amp.dailytelegraph.com.au/\\1'
        }
      },
      condition: {
        regexFilter: '^https?://www\\.dailytelegraph\\.com\\.au/(.+)',
        resourceTypes: ['main_frame']
      }
    }
  ]
});

// Disable javascript for these sites
chrome.declarativeNetRequest.updateDynamicRules({
  removeRuleIds: [4],
  addRules: [
    {
      id: 4,
      priority: 1,
      action: { type: 'block' },
      condition: {
        urlFilter: '*://*.newstatesman.com/*|*://*.outbrain.com/*|*://*.piano.io/*|*://*.poool.fr/*|*://*.qiota.com/*|*://*.tinypass.com/*',
        resourceTypes: ['script']
      }
    }
  ]
});

// Replace webRequest listeners with declarativeNetRequest rules
chrome.declarativeNetRequest.updateDynamicRules({
  removeRuleIds: [1, 2],
  addRules: [
    {
      id: 1,
      priority: 1,
      action: {
        type: 'modifyHeaders',
        requestHeaders: [
          { header: 'Referer', operation: 'set', value: 'https://www.google.com/' },
          { header: 'User-Agent', operation: 'set', value: userAgentDesktop }
        ]
      },
      condition: {
        urlFilter: '|http*',
        resourceTypes: ['main_frame']
      }
    },
    {
      id: 2,
      priority: 1,
      action: { type: 'block' },
      condition: {
        urlFilter: '|http*',
        resourceTypes: ['script'],
        domains: Object.keys(blockedRegexes)
      }
    }
  ]
});

// Function to create rules for removing cookies
function createRemoveCookieRules() {
  const rules = [];
  let ruleId = 1000; // Start from a high number to avoid conflicts with other rules

  for (const domain of _removeCookies) {
    if (enabledSites.includes(domain)) {
      rules.push({
        id: ruleId++,
        priority: 1,
        action: {
          type: 'removeCookies',
          cookieNames: ['*'] // Remove all cookies
        },
        condition: {
          domains: [domain],
          resourceTypes: ['main_frame']
        }
      });
    }
  }

  return rules;
}

// Update cookie removal rules
function updateCookieRemovalRules() {
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: Array.from({ length: 1000 }, (_, i) => i + 1000), // Remove all previous rules
    addRules: createRemoveCookieRules()
  });
}

// Call this function when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  updateCookieRemovalRules();
});

// Call this function when the enabled sites change
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.sites || changes.customSites) {
    updateCookieRemovalRules();
  }
});

// Google Analytics to anonymously track DAU (Chrome only)
function initGA () {
  (function (i, s, o, g, r, a, m) {
    i.GoogleAnalyticsObject = r;
    i[r] = i[r] || function () {
      (i[r].q = i[r].q || []).push(arguments);
    }, i[r].l = 1 * new Date();
    a = s.createElement(o), m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m);
  })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
  ga('create', 'UA-69824169-2', 'auto');
  ga('set', 'checkProtocolTask', null);
  ga('set', 'anonymizeIp', true);
  ga('send', 'pageview');
}

function isSiteEnabled (details) {
  const enabledSite = matchUrlDomain(enabledSites, details.url);
  if (enabledSite in restrictions) {
    return restrictions[enabledSite].test(details.url);
  }
  return !!enabledSite;
}

function matchUrlDomain (domains, url) {
  return matchDomain(domains, urlHost(url));
}

function matchDomain (domains, hostname) {
  let matchedDomain = false;
  if (!hostname) { hostname = window.location.hostname; }
  if (typeof domains === 'string') { domains = [domains]; }
  domains.some(domain => (hostname === domain || hostname.endsWith('.' + domain)) && (matchedDomain = domain));
  return matchedDomain;
}

function urlHost (url) {
  if (url && url.startsWith('http')) {
    try {
      return new URL(url).hostname;
    } catch (e) {
      console.log(`url not valid: ${url} error: ${e}`);
    }
  }
  return url;
}
