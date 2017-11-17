// better image but too low quality:
// http://com.ft.imagepublish.prod.s3.amazonaws.com/13435cd8-cbc9-11e7-aa33-c63fdc9b8c6c

export default (environment = 'development') => ({
  // eslint-disable-line

  // link file UUID
  id: 'a175094a-cba9-11e7-ab18-7a9fb7d6163e',

  // canonical URL of the published page
  //  get filled in by the ./configure script
  url: 'https://ig.ft.com/hammond-boxed-in/',

  // To set an exact publish date do this:
  publishedDate: new Date('2017-11-19T11:00:00Z'),

  headline: 'How Philip Hammond has been boxed in ahead of the autumn Budget',

  // summary === standfirst (Summary is what the content API calls it)
  summary: 'Fiscal commitments and economic data leave chancellor with little room for manoeuvre',

  topic: {
    name: 'UK Budget',
    url: 'https://www.ft.com/ukbudget',
  },

  // relatedArticle: {
  //   text: 'Related article »',
  //   url: 'https://en.wikipedia.org/wiki/Politics_and_the_English_Language',
  // },

  mainImage: {
    title: '',
    description: '',
    credit: '',

    // You can provide a UUID to an image and it was populate everything else
    // uuid: 'c4bf0be4-7c15-11e4-a7b8-00144feabdc0',

    // You can also provide a URL
    url: `https://www.ft.com/__origami/service/image/v2/images/raw/${encodeURIComponent(
      'http://com.ft.imagepublish.prod.s3.amazonaws.com/11d00ab8-cbc9-11e7-aa33-c63fdc9b8c6c',
    )}?source=ig&width=1264&quality=medium`,
  },

  // Byline can by a plain string, markdown, or array of authors
  // if array of authors, url is optional
  byline: [
    { name: 'Gemma Tetlow', url: 'https://twitter.com/gemmatetlow' },
    { name: 'Callum Locke', url: 'https://twitter.com/callumlocke' },
    { name: 'Caroline Nevitt', url: 'https://twitter.com/carolinenevitt' },
  ],

  // Appears in the HTML <title>
  title: '',

  // meta data
  description: '',

  /*
  TODO: Select Twitter card type -
        summary or summary_large_image

        Twitter card docs:
        https://dev.twitter.com/cards/markup
  */
  twitterCard: 'summary',

  /*
  TODO: Do you want to tweak any of the
        optional social meta data?
  */
  // General social
  // socialImage: '',
  // socialHeadline: '',
  // socialDescription: '',
  // twitterCreator: '@author's_account', // shows up in summary_large_image cards

  // TWEET BUTTON CUSTOM TEXT
  // tweetText: '',
  //
  // Twitter lists these as suggested accounts to follow after a user tweets (do not include @)
  // twitterRelatedAccounts: ['authors_account_here', 'ftdata'],

  // Fill out the Facebook/Twitter metadata sections below if you want to
  // override the General social options above

  // TWITTER METADATA (for Twitter cards)
  // twitterImage: '',
  // twitterHeadline: '',
  // twitterDescription: '',

  // FACEBOOK
  // facebookImage: '',
  // facebookHeadline: '',
  // facebookDescription: '',

  // ADVERTISING
  ads: {
    // Ad unit hierarchy makes ads more granular.
    gptSite: 'ft.com',
    // Start with ft.com and /companies /markets /world as appropriate to your story
    gptZone: false,
    // granular targeting is optional and will be specified by the ads team
    dfpTargeting: false,
  },

  tracking: {
    /*

    Microsite Name

    e.g. guffipedia, business-books, baseline.
    Used to query groups of pages, not intended for use with
    one off interactive pages. If you're building a microsite
    consider more custom tracking to allow better analysis.
    Also used for pages that do not have a UUID for whatever reason
    */
    // micrositeName: '',
    /*
    Product name

    This will usually default to IG
    however another value may be needed
    */
    // product: '',
  },
});
