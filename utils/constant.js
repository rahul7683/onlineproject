export const BankReasonCodes = {
    'MD06': 'MD06',
    'FaildCodes': ['AC01', 'AC04', 'AC06', 'AG02', 'AM04', 'MS02', 'MS03', 'SL01']
}

export const Roles = {
    'SuperAdmin': 'SuperAdmin',
    'Admin': 'Admin',
    'Developer': 'Developer',
    'Editor': 'Editor',
    'Support': 'Support'
}

export const LetterStatus = {
    'Created':0,
    'Sent': 1,
    'Undelivered': 5,
    'Failed': 4,
    "Printing":2,
    "processed_for_delivery":7,
    "completed":8,
    "Deliverd":3,
    "Cancelled":6
}

export const ReminderAmountIncreament = {
    'First':15,
    'Second': 40
}

export const Menus = [{
    slug: 'homepage/homepage-edit',
    label: 'Home Page',
    icon: '@/public/assets/images/home.png',
    type: 'website',
    roles: ['SuperAdmin', 'Admin', 'Editor', 'Developer']
}, {
    slug: 'categories',
    label: 'Categories',
    icon: '@/public/assets/images/cat.png',
    type: 'website',
    roles: ['SuperAdmin', 'Admin', 'Editor', 'Developer']

}, {
    slug: 'companies',
    label: 'Companies',
    icon: '@/public/assets/images/company.png',
    type: 'website',
    roles: ['SuperAdmin', 'Admin', 'Editor', 'Developer']
}, {
    slug: 'blog',
    label: 'Blog',
    icon: '@/public/assets/images/blog.png',
    type: 'website',
    roles: ['SuperAdmin', 'Admin', 'Editor', 'Developer']
}, {
    slug: 'common-pages',
    label: 'Common Pages',
    icon: '@/public/assets/images/privacy.png',
    type: 'website',
    roles: ['SuperAdmin', 'Admin', 'Editor', 'Developer']
},
{
    slug: 'email-template',
    label: 'Email Templates',
    icon: '@/public/assets/images/privacy.png',
    type: 'website',
    roles: ['SuperAdmin', 'Admin', 'Editor', 'Developer']
},
{
    slug: 'user-management',
    label: 'User Management',
    icon: '@/public/assets/images/user.png',
    type: 'website',
    roles: ['SuperAdmin']
},
{
    slug: 'settings',
    label: 'Setting',
    icon: '@/public/assets/images/setting.png',
    type: 'website',
    roles: ['SuperAdmin', 'Admin', 'Developer', 'Support']
},
 {
    slug: 'dashboard',
    label: 'Dashboard',
    icon: '@/public/assets/images/home.png',
    type: 'analytic',
    roles: ['SuperAdmin', 'Admin']
}, {
    slug: 'order',
    label: 'Orders',
    icon: '@/public/assets/images/order.png',
    type: 'analytic',
    roles: ['SuperAdmin', 'Admin', 'Support', 'Developer']

},{
    slug: 'order/statistics',
    label: 'Orders statistics',
    icon: '@/public/assets/images/order.png',
    type: 'analytic',
    roles: ['SuperAdmin', 'Admin']

},{
    slug: 'subscription-list',
    label: 'Subscription List',
    icon: '@/public/assets/images/order.png',
    type: 'analytic',
    roles: ['SuperAdmin', 'Admin', 'Support', 'Developer']

},
{
    slug: 'subscription-order-count',
    label: 'Subscription\'s Order List',
    icon: '@/public/assets/images/order.png',
    type: 'analytic',
    roles: ['SuperAdmin', 'Admin', 'Developer']

}
// {
//     slug: 'projections',
//     label: 'Projections',
//     icon: '',
//     type: 'analytic',
//     roles: ['SuperAdmin', 'Admin']
// },
//  {
//     slug: 'user-behavior',
//     label: 'User Behavior',
//     icon: '',
//     type: 'analytic',
//     roles: ['SuperAdmin', 'Admin']
// }, 
// {
//     slug: 'postbode',
//     label: 'Postbode',
//     icon: '',
//     type: 'analytic',
//     roles: ['SuperAdmin', 'Admin']
// }, {
//     slug: 'google-ads',
//     label: 'Google Ads',
//     icon: '',
//     type: 'analytic',
//     roles: ['SuperAdmin', 'Admin']
// }, {
//     slug: 'google-analytics',
//     label: 'Google Analytics',
//     icon: '',
//     type: 'analytic',
//     roles: ['SuperAdmin', 'Admin']
// }
]

export const StripePrices = {
	'2995': 'price_1ONE2sH4WIDMKylP7xFza8dU',//'price_1OD34EH4WIDMKylP4DY63HBu',
	'4205' : 'price_1OJyVBH4WIDMKylP38Kk7oq9',
    '8205' : 'price_1OJyZSH4WIDMKylPsLqLZWJT',
    '4245' : 'price_1OJyT2H4WIDMKylPIijG7AY9',
	'6995' :'price_1OJyWPH4WIDMKylP9rFdAJnD',
    DEV_SUBSCRIPTION_PRICE : 'price_1PuZo4H4WIDMKylPtXED84pO',
    PROD_SUBSCRIPTION_PRICE : 'price_1PvH5iH4WIDMKylPoeeIqsLM',
    DEV_PMC : 'pmc_1OAqCdH4WIDMKylPynH0xdyK',
    PROD_PMC : 'pmc_1PixpcH4WIDMKylPsveRk4ld',

    
}


export const SupportEmail = {
    'de': 'support.de@unsubby.com',
    'at': 'support.at@unsubby.com',
    'be': 'support.be@unsubby.com',
    'fr': 'support.fr@unsubby.com',
    'us': 'support.us@unsubby.com',
    'uk': 'support.uk@unsubby.com'

}

export const CountryData = {
    'be' : {
        'locale' : 'nl_BE',
        'paymentDescription' : 'Opzegging #company via eenmalige #method-betaling [BE] #orderId',
        'invalidIBANMessage':'Het IBAN-nummer is ongeldig. Vul een geldig IBAN-nummer in.', 
        'timeLeftToResubmit' : 'U kunt na #timeLeftinMIn minuten weer een brief sturen',
        'paymentNames' : {
            'creditcard' : 'Creditcard',
            'card' : 'Credit Card',
            'paypal' : 'PayPal',
            "google_pay":"Google Pay",
            "apple_pay":"Apple Pay",
            'eps':'Elektronische Betalingsstandaard',
            'giropay':'Giropay',
            'ideal':'iDEAL',
            'bancontact':'Bancontact',
            'kbc':' KBC/CBC Betaalknop',
            'belfius':'Belfius Betaalbutton',
            'directdebit' : 'SEPA',
            'applepay': 'Apple Pay'
        },
        'paymentStatement' : {
            'creditcard' : 'Unsubby via Mollie',
            'paypal' : 'Unsubby via Mollie',
            'eps':'Unsubby via Mollie',
            'giropay':'Unsubby via Mollie',
            'ideal':'Unsubby via Mollie',
            'bancontact':'Unsubby via Mollie',
            'kbc':'Unsubby via Mollie',
            'belfius':'Unsubby via Mollie',            
            'directdebit':'Unsubby via Mollie',
            'applepay': 'Unsubby via Mollie'
        },
        'subscriptionDescription' : 'my unsubby, BE-', //'My Unsubby maandelijkse abonnementskosten [BE]',
        'currency' : '&euro;',
        'myUnsubbyAmount': 495
    },
    'nl' : {
        'locale' : 'nl_NL',
        'paymentDescription' : 'Opzegging #company via eenmalige #method-betaling [NL] #orderId',
        'invalidIBANMessage':'Het IBAN-nummer is ongeldig. Vul een geldig IBAN-nummer in.', 
        'timeLeftToResubmit' : 'U kunt na #timeLeftinMIn minuten weer een brief sturen',
        'paymentNames' : {
            'creditcard' : 'Creditcard',
            'card' : 'Creditcard',
            'paypal' : 'PayPal',
            "google_pay":"Google Pay",
            "apple_pay":"Apple Pay",
            'eps':'Elektronische Betalingsstandaard',
            'giropay':'Giropay',
            'ideal':'iDEAL',
            'bancontact':'Bancontact',
            'kbc':' KBC/CBC Betaalknop',
            'belfius':'Belfius Betaalbutton',
            'directdebit':'SEPA',
            'applepay': 'Apple Pay'
        },
        'paymentStatement' : {
            'creditcard' : 'Mollie Abbo Stop NL',
            'paypal' : 'Abbo Stop via Mollie',
            'eps':'Abbo Stop via Mollie',
            'giropay':'Abbo Stop via Mollie',
            'ideal':'Abbo Stop via Stichting Mollie',
            'bancontact':'Abbo Stop via Mollie',
            'kbc':'Abbo Stop via Mollie',
            'belfius':'Abbo Stop via Mollie',
            'applepay': 'Abbo Stop via Mollie',
            'directdebit':'Abbo Stop via Mollie'
        },
        'subscriptionDescription' : 'my unsubby, NL-',//'My Unsubby maandelijkse abonnementskosten [NL]',
        'currency' : '&euro;',
        'myUnsubbyAmount': 495
    },
    'de' : {
        'locale' : 'de_DE',
        'paymentDescription' : 'Kündigung #company durch einmalige #method-Zahlung [DE] #orderId',
        'invalidIBANMessage':'Die IBAN-Nummer ist ungültig. Bitte geben Sie eine gültige IBAN-Nummer ein.' ,
        'timeLeftToResubmit' : 'Sie können in #timeLeftinMIn Minuten wieder einen Brief senden.',
        'paymentNames' : {
            'creditcard' : 'Kreditkarte',
            'card' : 'Kreditkarte',
            'paypal' : 'PayPal',
            "google_pay":"Google Pay",
            "apple_pay":"Apple Pay",
            'eps':'EPS',
            'giropay':'Giropay',
            'ideal':'iDEAL',
            'bancontact':'Bancontact',
            'kbc':'KBC/CBC Zahlungsbutton',
            'belfius':'Belfius Zahlungsbutton',
            'directdebit': 'SEPA',
            'applepay': 'Apple Pay'
        },
        'paymentStatement' : {
            'creditcard' : 'Unsubby über Mollie',
            'paypal' : 'Unsubby über Mollie',
            'eps':'Unsubby über Mollie',
            'giropay':'Unsubby über Mollie',
            'ideal':'Unsubby über Mollie',
            'bancontact':'Unsubby über Mollie',
            'kbc':'Unsubby über Mollie',
            'belfius':'Unsubby über Mollie',
            'directdebit':'Unsubby über Mollie',
            'applepay': 'Unsubby über Mollie'
        },
        'subscriptionDescription' : 'my unsubby, DE-',//'Monatliche Abonnementgebühr für My Unsubby [DE]',
        'currency' : '&euro;',
        'myUnsubbyAmount': 495
    },
    'at' : {
        'locale' : 'de_AT',
        'paymentDescription' : 'Kündigung #company durch einmalige #method-Zahlung [AT] #orderId',
        'invalidIBANMessage':'Die IBAN-Nummer ist ungültig. Bitte geben Sie eine gültige IBAN-Nummer ein.', 
        'timeLeftToResubmit' : 'Sie können in #timeLeftinMIn Minuten wieder einen Brief senden.',
        'paymentNames' : {
            'creditcard' : 'Kreditkarte',
            'card' : 'Kreditkarte',
            'paypal' : 'PayPal',
            "google_pay":"Google Pay",
            "apple_pay":"Apple Pay",
            'eps':'EPS',
            'giropay':'Giropay',
            'ideal':'iDEAL',
            'bancontact':'Bancontact',
            'kbc':'KBC / CBC Zahlungsbutton',
            'belfius':'Belfius Zahlungsbutton',
            'directdebit': 'SEPA',
            'applepay': 'Apple Pay'
        },
        'paymentStatement' : {
            'creditcard' : 'Unsubby über Mollie',
            'paypal' : 'Unsubby über Mollie',
            'eps':'Unsubby über Mollie',
            'giropay':'Unsubby über Mollie',
            'ideal':'Unsubby über Mollie',
            'bancontact':'Unsubby über Mollie',
            'kbc':'Unsubby über Mollie',
            'belfius':'Unsubby über Mollie',
            'directdebit':'Unsubby über Mollie',
            'applepay': 'Unsubby über Mollie'
        },
        'subscriptionDescription' : 'my unsubby, AT-',//'Monatliche Abonnementgebühr für My Unsubby [AT]',
        'currency' : '&euro;',
        'myUnsubbyAmount': 495
    },
    'fr' : {
        'locale' : 'fr_FR',
        'paymentDescription' : 'Résiliation de #company par paiement #method unique [FR] #orderId',
        'invalidIBANMessage':'Le numéro IBAN est invalide. Veuillez saisir un numéro IBAN valide.',
        'termsUrl' : '/conditions-generales',
        'timeLeftToResubmit' : 'Vous pouvez envoyer une autre lettre dans #timeLeftinMIn minutes',
        'paymentNames' : {
            'creditcard' : 'Carte de crédit',
            'card' : 'Carte de crédit',
            "google_pay":"Google Pay",
            "apple_pay":"Apple Pay",
            'paypal' : 'PayPal',
            'eps':'Norme de Paiement Électronique',
            'giropay':'Giropay',
            'ideal':'iDEAL',
            'bancontact':'Bancontact',
            'kbc':'Bouton de paiement KBC / CBC',
            'belfius':'Bouton de paiement Belfius',
            'directdebit':'SEPA',
            'applepay': 'Apple Pay'
        },
        'paymentStatement' : {
            'creditcard' : 'Unsubby über Mollie',
            'paypal' : 'Unsubby über Mollie',
            'eps':'Unsubby über Mollie',
            'giropay':'Unsubby über Mollie',
            'ideal':'Unsubby über Mollie',
            'bancontact':'Unsubby über Mollie',
            'kbc':'Unsubby über Mollie',
            'belfius':'Unsubby über Mollie',
            'applepay': 'Unsubby über Mollie',
            'directdebit':'Unsubby über Mollie'
        },
        'subscriptionDescription' : 'my unsubby, FR-',//`Frais d'abonnement mensuel My Unsubby [FR]`,
        'currency' : '&euro;',
        'myUnsubbyAmount': 495
    },
    'us' : {
        'locale' : 'en_US',
        'paymentDescription' : 'US-#orderId #company',
        'invalidIBANMessage':'Het IBAN-nummer is ongeldig. Vul een geldig IBAN-nummer in.', 
        'timeLeftToResubmit' : 'You have already sent a cancellation letter for this company. You can still cancel any other subscription.',
        'paymentNames' : {
            'creditcard' : 'Credit Card',
            'card' : 'Credit Card',
            "google_pay":"Google Pay",
            "apple_pay":"Apple Pay",
            'paypal' : 'PayPal',
            'eps':'eps',
            'giropay':'giropay',
            'ideal':'iDEAL',
            'bancontact':'Bancontact',
            'kbc':'KBC/CBC Payment Button',
            'belfius':'Belfius Pay Button',
            'directdebit':'Direct debit',
            'applepay': 'Apple Pay'
        },
        'paymentStatement' : {
            'creditcard' : 'Unsubby via Mollie',
            'paypal' : 'Unsubby via Mollie',
            'eps':'Unsubby via Mollie',
            'giropay':'Unsubby via Mollie',
            'ideal':'Unsubby via Mollie',
            'bancontact':'Unsubby via Mollie',
            'kbc':'Unsubby via Mollie',
            'belfius':'Unsubby via Mollie',
            'applepay': 'Unsubby via Mollie',
            'directdebit':'Unsubby via Mollie'
        },
        'subscriptionDescription' : 'my unsubby, US-',//'My Unsubby monthly subscription fee [US]',
        'currency' : '&dollar;',
        'myUnsubbyAmount': 749
    },
    'uk' : {
        'locale' : 'en_GB',
        'paymentDescription' : 'UK-#orderId #company',
        'invalidIBANMessage':'Het IBAN-nummer is ongeldig. Vul een geldig IBAN-nummer in.', 
        'timeLeftToResubmit' : 'You have already sent a cancellation letter for this company. You can still cancel any other subscription.',
        'paymentNames' : {
            'creditcard' : 'Credit Card',
            'card' : 'Credit Card',
            "google_pay":"Google Pay",
            "apple_pay":"Apple Pay",
            'paypal' : 'PayPal',
            'eps':'eps',
            'giropay':'giropay',
            'ideal':'iDEAL',
            'bancontact':'Bancontact',
            'kbc':'KBC/CBC Payment Button',
            'belfius':'Belfius Pay Button',
            'directdebit':'Direct debit',
            'applepay': 'Apple Pay'
        },
        'paymentStatement' : {
            'creditcard' : 'Unsubby via Mollie',
            'paypal' : 'Unsubby via Mollie',
            'eps':'Unsubby via Mollie',
            'giropay':'Unsubby via Mollie',
            'ideal':'Unsubby via Mollie',
            'bancontact':'Unsubby via Mollie',
            'kbc':'Unsubby via Mollie',
            'belfius':'Unsubby via Mollie',
            'applepay': 'Unsubby via Mollie',
            'directdebit':'Unsubby via Mollie'
        },
        'subscriptionDescription' : 'my unsubby, UK-',//'My Unsubby monthly subscription fee [US]',
        'currency' : '&#163;'
    }
}