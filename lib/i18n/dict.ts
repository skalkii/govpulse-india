import type { Locale } from "./locales";

export interface Dict {
  brand: { suffix: string };
  nav: { about: string };
  footer: { attribution: string; disclaimer: string };
  landing: {
    titlePrefix: string;
    titleAccent: string;
    tagline: string;
  };
  modules: {
    aqi: {
      title: string;
      description: string;
      tagline: string;
      ui: {
        cityPlaceholder: string;
        check: string;
        pickCity: string;
        pickHint: string;
        rightNow: string;
        next24h: string;
        stations: string;
        worst: string;
        forecastNote: string;
        dominant: string;
        averagedAcross: string;
        couldNotLoad: string;
        listView: string;
        mapView: string;
      };
    };
    rivers: {
      title: string;
      description: string;
      tagline: string;
      ui: {
        statePlaceholder: string;
        showStations: string;
        pickState: string;
        pickHint: string;
        noStations: string;
        headlineIssue: string;
        suitableFor: string;
        openInMaps: string;
        listView: string;
        mapView: string;
      };
    };
    rainfall: {
      title: string;
      description: string;
      tagline: string;
      ui: {
        districtPlaceholder: string;
        monsoon: string;
        annual: string;
        currentMm: string;
        compare: string;
        pickDistrict: string;
        pickHint: string;
        baseline: string;
        thisSeason: string;
        meanRainfall: string;
        stdDeviation: string;
        sampleYears: string;
        cov: string;
        vsNormal: string;
        verdicts: {
          "much below": string;
          "below normal": string;
          normal: string;
          "above normal": string;
          "much above": string;
        };
      };
    };
    solar: {
      title: string;
      description: string;
      tagline: string;
      ui: {
        pincode: string;
        roofSqft: string;
        monthlyBill: string;
        calculate: string;
        fillForm: string;
        fillHint: string;
        payback: string;
        billOffset: string;
        netSavings25: string;
        capacity: string;
        localGhi: string;
        annualGen: string;
        installCost: string;
        annualSavings: string;
        monthlySavings: string;
        years: string;
        couldNotCompute: string;
      };
    };
  };
  actions: { share: string; tryAgain: string; backHome: string };
  about: {
    heading: string;
    intro: string;
    footnote: string;
    sourcesHeading: string;
    disclaimerHeading: string;
    disclaimerBody: string;
    backLink: string;
  };
}

const en: Dict = {
  brand: { suffix: "India" },
  nav: { about: "About" },
  footer: {
    attribution: "Data from CPCB, IMD, and MNRE via",
    disclaimer: "Informational use only — not for emergencies.",
  },
  landing: {
    titlePrefix: "Public data,",
    titleAccent: "made useful",
    tagline:
      "Free tools built on India's open government data. No login, no tracking, no fluff — just answers.",
  },
  modules: {
    aqi: {
      title: "AQI Now & Next 24h",
      description: "Live air quality + simple forecast for any Indian city.",
      tagline:
        "Live air quality + a transparent rules-based 24h forecast for any Indian city.",
      ui: {
        cityPlaceholder: "Type a city",
        check: "Check AQI",
        pickCity: "Pick a city to see live AQI",
        pickHint: "CPCB monitoring stations refresh hourly.",
        rightNow: "right now",
        next24h: "Next 24 hours",
        stations: "Stations",
        worst: "Worst",
        forecastNote:
          "Forecast applies a fixed diurnal multiplier (peaks ~7am and ~9pm) to the current observation. Not a model — auditable rules.",
        dominant: "Dominant pollutant",
        averagedAcross: "Averaged across",
        couldNotLoad: "Couldn't load AQI",
        listView: "List",
        mapView: "Map",
      },
    },
    rivers: {
      title: "River Health Check",
      description: "Water quality at CPCB monitoring stations near you.",
      tagline: "CPCB station readings: dissolved oxygen, BOD, pH, fecal coliform.",
      ui: {
        statePlaceholder: "Type a state",
        showStations: "Show stations",
        pickState: "Pick a state to see CPCB monitoring stations",
        pickHint: "Each station rated against CPCB designated best-use classes.",
        noStations: "No bundled stations for",
        headlineIssue: "Headline issue",
        suitableFor: "Suitable for",
        openInMaps: "Open in Google Maps",
        listView: "List",
        mapView: "Map",
      },
    },
    rainfall: {
      title: "Rainfall Anomaly",
      description: "Is this monsoon unusual? Compare to district history.",
      tagline:
        "How this season's rainfall compares to a district's long-period average.",
      ui: {
        districtPlaceholder: "Type a district",
        monsoon: "Monsoon (Jun-Sep)",
        annual: "Annual",
        currentMm: "Current mm (optional)",
        compare: "Compare",
        pickDistrict: "Pick a district to see its baseline",
        pickHint: "Then add this season's rainfall total to see the anomaly.",
        baseline: "baseline",
        thisSeason: "This season",
        meanRainfall: "Mean rainfall",
        stdDeviation: "Std deviation",
        sampleYears: "Sample years",
        cov: "Coefficient of variation",
        vsNormal: "vs normal",
        verdicts: {
          "much below": "much below",
          "below normal": "below normal",
          normal: "normal",
          "above normal": "above normal",
          "much above": "much above",
        },
      },
    },
    solar: {
      title: "Solar ROI Calculator",
      description: "Rooftop solar payback period by pincode.",
      tagline:
        "Rooftop solar payback estimate by pincode, roof area, and current bill.",
      ui: {
        pincode: "Pincode",
        roofSqft: "Roof area (sq ft)",
        monthlyBill: "Monthly bill (₹)",
        calculate: "Calculate payback",
        fillForm: "Fill the form to see your payback",
        fillHint: "Estimates only — get a professional installer quote before committing.",
        payback: "Payback",
        billOffset: "Bill offset",
        netSavings25: "25-yr net savings",
        capacity: "Capacity",
        localGhi: "Local GHI",
        annualGen: "Annual generation",
        installCost: "Install cost",
        annualSavings: "Annual savings",
        monthlySavings: "Monthly savings",
        years: "yrs",
        couldNotCompute: "Couldn't compute",
      },
    },
  },
  actions: { share: "Share on WhatsApp", tryAgain: "Try again", backHome: "Back home" },
  about: {
    heading: "About GovPulse India",
    intro:
      "India publishes a lot of useful public data through data.gov.in and individual ministry portals. Most of it sits in spreadsheets, unwieldy dashboards, or PDFs. GovPulse turns the highest-value slices into one-click answers.",
    footnote: "One app, no database, no login. Built and run for ₹0/month.",
    sourcesHeading: "Data sources",
    disclaimerHeading: "Disclaimer",
    disclaimerBody:
      "Estimates and informational summaries only. Don't use these tools for emergency decisions, regulatory filings, or professional advice. Cross-check against the original government source linked on each result.",
    backLink: "← Back to all tools",
  },
};

const hi: Dict = {
  brand: { suffix: "इंडिया" },
  nav: { about: "हमारे बारे में" },
  footer: {
    attribution: "डेटा CPCB, IMD और MNRE से",
    disclaimer: "केवल जानकारी के लिए — आपातकालीन उपयोग के लिए नहीं।",
  },
  landing: {
    titlePrefix: "सरकारी डेटा,",
    titleAccent: "उपयोगी रूप में",
    tagline:
      "भारत के खुले सरकारी डेटा पर बने मुफ़्त उपकरण। कोई लॉगिन नहीं, कोई ट्रैकिंग नहीं — बस सीधा जवाब।",
  },
  modules: {
    aqi: {
      title: "वायु गुणवत्ता और 24 घंटे का पूर्वानुमान",
      description: "किसी भी भारतीय शहर के लिए लाइव AQI और सरल पूर्वानुमान।",
      tagline:
        "किसी भी भारतीय शहर के लिए लाइव वायु गुणवत्ता और पारदर्शी 24 घंटे का पूर्वानुमान।",
      ui: {
        cityPlaceholder: "शहर का नाम लिखें",
        check: "AQI देखें",
        pickCity: "लाइव AQI देखने के लिए शहर चुनें",
        pickHint: "CPCB निगरानी स्टेशन हर घंटे अपडेट होते हैं।",
        rightNow: "अभी",
        next24h: "अगले 24 घंटे",
        stations: "स्टेशन",
        worst: "सबसे खराब",
        forecastNote:
          "पूर्वानुमान वर्तमान रीडिंग पर एक निश्चित दैनिक गुणक (शिखर ~7 बजे और ~9 बजे) लागू करता है। यह मॉडल नहीं — पारदर्शी नियम।",
        dominant: "मुख्य प्रदूषक",
        averagedAcross: "औसत स्टेशनों में",
        couldNotLoad: "AQI लोड नहीं हुआ",
        listView: "सूची",
        mapView: "नक्शा",
      },
    },
    rivers: {
      title: "नदी स्वास्थ्य जांच",
      description: "पास के CPCB निगरानी स्टेशनों पर पानी की गुणवत्ता।",
      tagline: "CPCB स्टेशन रीडिंग: घुलित ऑक्सीजन, BOD, pH, फीकल कोलीफॉर्म।",
      ui: {
        statePlaceholder: "राज्य का नाम लिखें",
        showStations: "स्टेशन दिखाएं",
        pickState: "CPCB निगरानी स्टेशन देखने के लिए राज्य चुनें",
        pickHint: "प्रत्येक स्टेशन को CPCB के निर्धारित उपयोग वर्गों के अनुसार रेट किया गया है।",
        noStations: "इसके लिए कोई स्टेशन नहीं",
        headlineIssue: "मुख्य समस्या",
        suitableFor: "उपयुक्त है",
        openInMaps: "Google Maps में खोलें",
        listView: "सूची",
        mapView: "नक्शा",
      },
    },
    rainfall: {
      title: "वर्षा विसंगति",
      description: "क्या यह मानसून असामान्य है? जिले के इतिहास से तुलना करें।",
      tagline:
        "इस मौसम की वर्षा जिले के दीर्घकालिक औसत से कैसी तुलना करती है।",
      ui: {
        districtPlaceholder: "जिले का नाम लिखें",
        monsoon: "मानसून (जून-सितंबर)",
        annual: "वार्षिक",
        currentMm: "वर्तमान मिमी (वैकल्पिक)",
        compare: "तुलना करें",
        pickDistrict: "जिले का आधार देखने के लिए चुनें",
        pickHint: "फिर इस मौसम की वर्षा जोड़ें ताकि विसंगति देख सकें।",
        baseline: "आधार",
        thisSeason: "यह मौसम",
        meanRainfall: "औसत वर्षा",
        stdDeviation: "मानक विचलन",
        sampleYears: "वर्षों की संख्या",
        cov: "विचरण गुणांक",
        vsNormal: "सामान्य के मुकाबले",
        verdicts: {
          "much below": "बहुत कम",
          "below normal": "सामान्य से कम",
          normal: "सामान्य",
          "above normal": "सामान्य से ज़्यादा",
          "much above": "बहुत ज़्यादा",
        },
      },
    },
    solar: {
      title: "सोलर ROI कैलकुलेटर",
      description: "पिनकोड के अनुसार छत पर सौर ऊर्जा की भुगतान अवधि।",
      tagline:
        "पिनकोड, छत क्षेत्र और वर्तमान बिल के अनुसार छत पर सौर भुगतान अनुमान।",
      ui: {
        pincode: "पिनकोड",
        roofSqft: "छत क्षेत्र (वर्ग फुट)",
        monthlyBill: "मासिक बिल (₹)",
        calculate: "भुगतान अवधि निकालें",
        fillForm: "अपनी भुगतान अवधि देखने के लिए फ़ॉर्म भरें",
        fillHint: "केवल अनुमान — स्थापना से पहले पेशेवर कोट लें।",
        payback: "भुगतान अवधि",
        billOffset: "बिल कमी",
        netSavings25: "25 वर्ष की कुल बचत",
        capacity: "क्षमता",
        localGhi: "स्थानीय GHI",
        annualGen: "वार्षिक उत्पादन",
        installCost: "स्थापना लागत",
        annualSavings: "वार्षिक बचत",
        monthlySavings: "मासिक बचत",
        years: "वर्ष",
        couldNotCompute: "गणना नहीं हो सकी",
      },
    },
  },
  actions: { share: "WhatsApp पर शेयर करें", tryAgain: "फिर से कोशिश करें", backHome: "मुख्य पृष्ठ" },
  about: {
    heading: "GovPulse India के बारे में",
    intro:
      "भारत data.gov.in और मंत्रालय पोर्टलों के माध्यम से उपयोगी सार्वजनिक डेटा प्रकाशित करता है। अधिकांश डेटा स्प्रेडशीट्स और PDF में बैठा है। GovPulse इसके सबसे उपयोगी हिस्सों को एक-क्लिक उत्तरों में बदलता है।",
    footnote: "एक ऐप, कोई डेटाबेस नहीं, कोई लॉगिन नहीं। ₹0/माह में चलता है।",
    sourcesHeading: "डेटा स्रोत",
    disclaimerHeading: "अस्वीकरण",
    disclaimerBody:
      "केवल अनुमान। आपातकालीन निर्णयों, नियामक फाइलिंग, या पेशेवर सलाह के लिए उपयोग न करें। हमेशा मूल सरकारी स्रोत से क्रॉस-चेक करें।",
    backLink: "← सभी टूल पर वापस",
  },
};

const kn: Dict = {
  brand: { suffix: "ಭಾರತ" },
  nav: { about: "ನಮ್ಮ ಬಗ್ಗೆ" },
  footer: {
    attribution: "ಡೇಟಾ CPCB, IMD ಮತ್ತು MNRE ನಿಂದ",
    disclaimer: "ಮಾಹಿತಿಗಾಗಿ ಮಾತ್ರ — ತುರ್ತು ಪರಿಸ್ಥಿತಿಗೆ ಬಳಸಬೇಡಿ.",
  },
  landing: {
    titlePrefix: "ಸಾರ್ವಜನಿಕ ಡೇಟಾ,",
    titleAccent: "ಉಪಯುಕ್ತವಾಗಿ",
    tagline:
      "ಭಾರತದ ಮುಕ್ತ ಸರ್ಕಾರಿ ಡೇಟಾದ ಮೇಲೆ ಕಟ್ಟಿದ ಉಚಿತ ಸಾಧನಗಳು. ಲಾಗಿನ್ ಬೇಡ, ಟ್ರ್ಯಾಕಿಂಗ್ ಬೇಡ — ಕೇವಲ ಉತ್ತರಗಳು.",
  },
  modules: {
    aqi: {
      title: "AQI ಈಗ ಮತ್ತು ಮುಂದಿನ 24 ಗಂಟೆ",
      description: "ಯಾವುದೇ ಭಾರತೀಯ ನಗರಕ್ಕೆ ಲೈವ್ ವಾಯು ಗುಣಮಟ್ಟ + ಸರಳ ಮುನ್ಸೂಚನೆ.",
      tagline:
        "ಯಾವುದೇ ಭಾರತೀಯ ನಗರಕ್ಕೆ ಲೈವ್ ವಾಯು ಗುಣಮಟ್ಟ + ಪಾರದರ್ಶಕ 24 ಗಂಟೆಯ ಮುನ್ಸೂಚನೆ.",
      ui: {
        cityPlaceholder: "ನಗರ ಹೆಸರು ಬರೆಯಿರಿ",
        check: "AQI ನೋಡಿ",
        pickCity: "ಲೈವ್ AQI ನೋಡಲು ನಗರ ಆಯ್ಕೆಮಾಡಿ",
        pickHint: "CPCB ಮೇಲ್ವಿಚಾರಣಾ ಕೇಂದ್ರಗಳು ಪ್ರತಿ ಗಂಟೆಗೆ ಅಪ್‌ಡೇಟ್ ಆಗುತ್ತವೆ.",
        rightNow: "ಈಗ",
        next24h: "ಮುಂದಿನ 24 ಗಂಟೆ",
        stations: "ಕೇಂದ್ರಗಳು",
        worst: "ಅತ್ಯಂತ ಕೆಟ್ಟ",
        forecastNote:
          "ಮುನ್ಸೂಚನೆ ಪ್ರಸ್ತುತ ಓದುವಿಕೆಗೆ ನಿಗದಿತ ದೈನಂದಿನ ಗುಣಕವನ್ನು ಅನ್ವಯಿಸುತ್ತದೆ. ಮಾದರಿ ಅಲ್ಲ — ಪಾರದರ್ಶಕ ನಿಯಮಗಳು.",
        dominant: "ಮುಖ್ಯ ಮಾಲಿನ್ಯಕಾರಕ",
        averagedAcross: "ಸರಾಸರಿ ಕೇಂದ್ರಗಳಲ್ಲಿ",
        couldNotLoad: "AQI ಲೋಡ್ ಆಗಲಿಲ್ಲ",
        listView: "ಪಟ್ಟಿ",
        mapView: "ನಕ್ಷೆ",
      },
    },
    rivers: {
      title: "ನದಿ ಆರೋಗ್ಯ ತಪಾಸಣೆ",
      description: "ನಿಮ್ಮ ಹತ್ತಿರದ CPCB ಮೇಲ್ವಿಚಾರಣಾ ಕೇಂದ್ರಗಳಲ್ಲಿ ನೀರಿನ ಗುಣಮಟ್ಟ.",
      tagline: "CPCB ಕೇಂದ್ರ ಓದುಗಳು: ಕರಗಿದ ಆಮ್ಲಜನಕ, BOD, pH, ಫೀಕಲ್ ಕೋಲಿಫಾರ್ಮ್.",
      ui: {
        statePlaceholder: "ರಾಜ್ಯ ಹೆಸರು ಬರೆಯಿರಿ",
        showStations: "ಕೇಂದ್ರಗಳನ್ನು ತೋರಿಸಿ",
        pickState: "CPCB ಕೇಂದ್ರಗಳನ್ನು ನೋಡಲು ರಾಜ್ಯ ಆಯ್ಕೆಮಾಡಿ",
        pickHint: "ಪ್ರತಿ ಕೇಂದ್ರವು CPCB ನಿಗದಿತ ಬಳಕೆ ವರ್ಗಗಳ ವಿರುದ್ಧ ರೇಟ್ ಮಾಡಲ್ಪಟ್ಟಿದೆ.",
        noStations: "ಇದಕ್ಕಾಗಿ ಯಾವುದೇ ಕೇಂದ್ರಗಳಿಲ್ಲ",
        headlineIssue: "ಮುಖ್ಯ ಸಮಸ್ಯೆ",
        suitableFor: "ಸೂಕ್ತ",
        openInMaps: "Google Maps ನಲ್ಲಿ ತೆರೆಯಿರಿ",
        listView: "ಪಟ್ಟಿ",
        mapView: "ನಕ್ಷೆ",
      },
    },
    rainfall: {
      title: "ಮಳೆಯ ವ್ಯತ್ಯಾಸ",
      description: "ಈ ಮುಂಗಾರು ಅಸಾಮಾನ್ಯವೇ? ಜಿಲ್ಲೆಯ ಇತಿಹಾಸದೊಂದಿಗೆ ಹೋಲಿಸಿ.",
      tagline:
        "ಈ ಋತುವಿನ ಮಳೆ ಜಿಲ್ಲೆಯ ದೀರ್ಘಕಾಲೀನ ಸರಾಸರಿಯೊಂದಿಗೆ ಹೇಗೆ ಹೋಲಿಸುತ್ತದೆ.",
      ui: {
        districtPlaceholder: "ಜಿಲ್ಲೆ ಬರೆಯಿರಿ",
        monsoon: "ಮುಂಗಾರು (ಜೂನ್-ಸೆಪ್ಟೆಂ)",
        annual: "ವಾರ್ಷಿಕ",
        currentMm: "ಪ್ರಸ್ತುತ ಮಿಮೀ (ಐಚ್ಛಿಕ)",
        compare: "ಹೋಲಿಸಿ",
        pickDistrict: "ಜಿಲ್ಲೆಯ ಮೂಲಭೂತ ನೋಡಲು ಆಯ್ಕೆಮಾಡಿ",
        pickHint: "ನಂತರ ಈ ಋತುವಿನ ಮಳೆ ಸೇರಿಸಿ.",
        baseline: "ಮೂಲ",
        thisSeason: "ಈ ಋತು",
        meanRainfall: "ಸರಾಸರಿ ಮಳೆ",
        stdDeviation: "ಪ್ರಮಾಣಿತ ವಿಚಲನ",
        sampleYears: "ವರ್ಷಗಳ ಸಂಖ್ಯೆ",
        cov: "ವ್ಯತ್ಯಾಸ ಗುಣಾಂಕ",
        vsNormal: "ಸಾಮಾನ್ಯಕ್ಕೆ",
        verdicts: {
          "much below": "ತುಂಬಾ ಕಡಿಮೆ",
          "below normal": "ಸಾಮಾನ್ಯಕ್ಕಿಂತ ಕಡಿಮೆ",
          normal: "ಸಾಮಾನ್ಯ",
          "above normal": "ಸಾಮಾನ್ಯಕ್ಕಿಂತ ಹೆಚ್ಚು",
          "much above": "ತುಂಬಾ ಹೆಚ್ಚು",
        },
      },
    },
    solar: {
      title: "ಸೌರ ROI ಕ್ಯಾಲ್ಕುಲೇಟರ್",
      description: "ಪಿನ್‌ಕೋಡ್ ಪ್ರಕಾರ ಮೇಲ್ಛಾವಣಿಯ ಸೌರ ಮರಳುವ ಅವಧಿ.",
      tagline:
        "ಪಿನ್‌ಕೋಡ್, ಮೇಲ್ಛಾವಣಿ ಪ್ರದೇಶ ಮತ್ತು ಪ್ರಸ್ತುತ ಬಿಲ್‌ನ ಆಧಾರದ ಮೇಲೆ ಸೌರ ಮರಳುವ ಅಂದಾಜು.",
      ui: {
        pincode: "ಪಿನ್‌ಕೋಡ್",
        roofSqft: "ಮೇಲ್ಛಾವಣಿ ವಿಸ್ತೀರ್ಣ (ಚದರ ಅಡಿ)",
        monthlyBill: "ಮಾಸಿಕ ಬಿಲ್ (₹)",
        calculate: "ಮರಳುವ ಅವಧಿ ಲೆಕ್ಕಾಚಾರ",
        fillForm: "ನಿಮ್ಮ ಮರಳುವ ಅವಧಿ ನೋಡಲು ಫಾರ್ಮ್ ಭರ್ತಿ ಮಾಡಿ",
        fillHint: "ಕೇವಲ ಅಂದಾಜು — ಸ್ಥಾಪನೆಗೆ ಮುಂಚೆ ವೃತ್ತಿಪರ ಕೋಟ್ ಪಡೆಯಿರಿ.",
        payback: "ಮರಳುವ ಅವಧಿ",
        billOffset: "ಬಿಲ್ ಕಡಿತ",
        netSavings25: "25 ವರ್ಷ ಒಟ್ಟು ಉಳಿತಾಯ",
        capacity: "ಸಾಮರ್ಥ್ಯ",
        localGhi: "ಸ್ಥಳೀಯ GHI",
        annualGen: "ವಾರ್ಷಿಕ ಉತ್ಪಾದನೆ",
        installCost: "ಸ್ಥಾಪನೆ ವೆಚ್ಚ",
        annualSavings: "ವಾರ್ಷಿಕ ಉಳಿತಾಯ",
        monthlySavings: "ಮಾಸಿಕ ಉಳಿತಾಯ",
        years: "ವರ್ಷ",
        couldNotCompute: "ಲೆಕ್ಕಾಚಾರ ಆಗಲಿಲ್ಲ",
      },
    },
  },
  actions: { share: "WhatsApp ನಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ", tryAgain: "ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ", backHome: "ಮುಖ್ಯ ಪುಟ" },
  about: {
    heading: "GovPulse India ಬಗ್ಗೆ",
    intro:
      "ಭಾರತ data.gov.in ಮತ್ತು ಮಂತ್ರಾಲಯ ಪೋರ್ಟಲ್‌ಗಳ ಮೂಲಕ ಉಪಯುಕ್ತ ಸಾರ್ವಜನಿಕ ಡೇಟಾ ಪ್ರಕಟಿಸುತ್ತದೆ. ಬಹಳಷ್ಟು ಡೇಟಾ ಸ್ಪ್ರೆಡ್‌ಶೀಟ್ ಮತ್ತು PDF ಗಳಲ್ಲಿ ಕುಳಿತಿದೆ. GovPulse ಅದನ್ನು ಒಂದು ಕ್ಲಿಕ್ ಉತ್ತರಗಳಾಗಿ ಬದಲಾಯಿಸುತ್ತದೆ.",
    footnote: "ಒಂದು ಆಪ್, ಡೇಟಾಬೇಸ್ ಇಲ್ಲ, ಲಾಗಿನ್ ಇಲ್ಲ. ₹0/ತಿಂಗಳು.",
    sourcesHeading: "ಡೇಟಾ ಮೂಲಗಳು",
    disclaimerHeading: "ನಿರಾಕರಣೆ",
    disclaimerBody:
      "ಕೇವಲ ಅಂದಾಜು. ತುರ್ತು ನಿರ್ಣಯ, ನಿಯಂತ್ರಕ ಸಲ್ಲಿಕೆ, ಅಥವಾ ವೃತ್ತಿಪರ ಸಲಹೆಗೆ ಬಳಸಬೇಡಿ. ಮೂಲ ಸರ್ಕಾರಿ ಮೂಲಕ್ಕೆ ಕ್ರಾಸ್-ಚೆಕ್ ಮಾಡಿ.",
    backLink: "← ಎಲ್ಲಾ ಸಾಧನಗಳಿಗೆ ಹಿಂದಿರುಗಿ",
  },
};

const mr: Dict = {
  brand: { suffix: "इंडिया" },
  nav: { about: "आमच्याबद्दल" },
  footer: {
    attribution: "डेटा CPCB, IMD आणि MNRE कडून",
    disclaimer: "केवळ माहितीसाठी — आपत्कालीन वापरासाठी नाही.",
  },
  landing: {
    titlePrefix: "सार्वजनिक डेटा,",
    titleAccent: "उपयुक्त बनवलेला",
    tagline:
      "भारताच्या खुल्या सरकारी डेटावर तयार केलेली विनामूल्य साधने. लॉगिन नाही, ट्रॅकिंग नाही — फक्त उत्तरे.",
  },
  modules: {
    aqi: {
      title: "AQI आता आणि पुढील 24 तास",
      description: "कोणत्याही भारतीय शहरासाठी थेट हवेची गुणवत्ता आणि सोपा अंदाज.",
      tagline:
        "कोणत्याही भारतीय शहरासाठी थेट हवेची गुणवत्ता आणि पारदर्शक 24 तास अंदाज.",
      ui: {
        cityPlaceholder: "शहराचे नाव लिहा",
        check: "AQI तपासा",
        pickCity: "थेट AQI पाहण्यासाठी शहर निवडा",
        pickHint: "CPCB स्टेशन्स दर तासाला अद्ययावत होतात.",
        rightNow: "आत्ता",
        next24h: "पुढील 24 तास",
        stations: "स्टेशन्स",
        worst: "सर्वात वाईट",
        forecastNote:
          "अंदाज वर्तमान वाचनावर निश्चित दैनंदिन गुणक लागू करतो. मॉडेल नाही — पारदर्शक नियम.",
        dominant: "मुख्य प्रदूषक",
        averagedAcross: "सरासरी स्टेशन्समध्ये",
        couldNotLoad: "AQI लोड झाले नाही",
        listView: "यादी",
        mapView: "नकाशा",
      },
    },
    rivers: {
      title: "नदी आरोग्य तपासणी",
      description: "तुमच्या जवळच्या CPCB निरीक्षण केंद्रांवर पाण्याची गुणवत्ता.",
      tagline: "CPCB केंद्रावरील वाचने: विरघळलेला ऑक्सिजन, BOD, pH, मलमूत्र कोलिफॉर्म.",
      ui: {
        statePlaceholder: "राज्याचे नाव लिहा",
        showStations: "स्टेशन्स दाखवा",
        pickState: "CPCB केंद्रे पाहण्यासाठी राज्य निवडा",
        pickHint: "प्रत्येक केंद्र CPCB निर्धारित वापर वर्गांविरुद्ध रेट केलेले.",
        noStations: "यासाठी स्टेशन्स नाहीत",
        headlineIssue: "मुख्य समस्या",
        suitableFor: "योग्य",
        openInMaps: "Google Maps मध्ये उघडा",
        listView: "यादी",
        mapView: "नकाशा",
      },
    },
    rainfall: {
      title: "पावसाची विसंगती",
      description: "हा पावसाळा असामान्य आहे का? जिल्ह्याच्या इतिहासाशी तुलना करा.",
      tagline:
        "या हंगामातील पाऊस जिल्ह्याच्या दीर्घकालीन सरासरीशी कसा तुलनात्मक आहे.",
      ui: {
        districtPlaceholder: "जिल्ह्याचे नाव लिहा",
        monsoon: "मान्सून (जून-सप्टे)",
        annual: "वार्षिक",
        currentMm: "सध्याचे मिमी (पर्यायी)",
        compare: "तुलना करा",
        pickDistrict: "जिल्ह्याचा आधार पाहण्यासाठी निवडा",
        pickHint: "नंतर या हंगामातील पाऊस जोडा.",
        baseline: "आधार",
        thisSeason: "हा हंगाम",
        meanRainfall: "सरासरी पाऊस",
        stdDeviation: "मानक विचलन",
        sampleYears: "वर्षांची संख्या",
        cov: "विचरण गुणांक",
        vsNormal: "सामान्याच्या तुलनेत",
        verdicts: {
          "much below": "खूप कमी",
          "below normal": "सामान्यापेक्षा कमी",
          normal: "सामान्य",
          "above normal": "सामान्यापेक्षा जास्त",
          "much above": "खूप जास्त",
        },
      },
    },
    solar: {
      title: "सोलर ROI कॅल्क्युलेटर",
      description: "पिनकोडनुसार छतावरील सौर परतफेड कालावधी.",
      tagline:
        "पिनकोड, छताचे क्षेत्रफळ आणि सध्याच्या बिलानुसार छतावरील सौर परतफेड अंदाज.",
      ui: {
        pincode: "पिनकोड",
        roofSqft: "छताचे क्षेत्र (चौ फूट)",
        monthlyBill: "मासिक बिल (₹)",
        calculate: "परतफेड कालावधी काढा",
        fillForm: "आपली परतफेड पाहण्यासाठी फॉर्म भरा",
        fillHint: "केवळ अंदाज — स्थापनेपूर्वी व्यावसायिक कोट घ्या.",
        payback: "परतफेड",
        billOffset: "बिल कपात",
        netSavings25: "25 वर्ष एकूण बचत",
        capacity: "क्षमता",
        localGhi: "स्थानिक GHI",
        annualGen: "वार्षिक उत्पादन",
        installCost: "स्थापना खर्च",
        annualSavings: "वार्षिक बचत",
        monthlySavings: "मासिक बचत",
        years: "वर्षे",
        couldNotCompute: "गणना करू शकलो नाही",
      },
    },
  },
  actions: { share: "WhatsApp वर शेअर करा", tryAgain: "पुन्हा प्रयत्न करा", backHome: "मुख्यपृष्ठ" },
  about: {
    heading: "GovPulse India बद्दल",
    intro:
      "भारत data.gov.in आणि मंत्रालयांद्वारे उपयुक्त सार्वजनिक डेटा प्रकाशित करतो. बहुतेक डेटा स्प्रेडशीट्स आणि PDF मध्ये बसलेला आहे. GovPulse त्याला एक-क्लिक उत्तरांमध्ये बदलतो.",
    footnote: "एक अॅप, डेटाबेस नाही, लॉगिन नाही. ₹0/महिना.",
    sourcesHeading: "डेटा स्रोत",
    disclaimerHeading: "अस्वीकरण",
    disclaimerBody:
      "केवळ अंदाज. आपत्कालीन निर्णय, नियामक फायलिंग किंवा व्यावसायिक सल्ल्यासाठी वापरू नका. नेहमी मूळ सरकारी स्रोताशी क्रॉस-चेक करा.",
    backLink: "← सर्व साधनांकडे परत",
  },
};

const ne: Dict = {
  brand: { suffix: "इन्डिया" },
  nav: { about: "हाम्रो बारेमा" },
  footer: {
    attribution: "डाटा CPCB, IMD र MNRE बाट",
    disclaimer: "जानकारीको लागि मात्र — आपतकालीन प्रयोगको लागि होइन।",
  },
  landing: {
    titlePrefix: "सार्वजनिक डाटा,",
    titleAccent: "उपयोगी बनाइएको",
    tagline:
      "भारतको खुला सरकारी डाटामा बनाइएका निःशुल्क उपकरणहरू। लगइन छैन, ट्र्याकिङ छैन — केवल जवाफहरू।",
  },
  modules: {
    aqi: {
      title: "AQI अहिले र अर्को 24 घण्टा",
      description: "कुनै पनि भारतीय शहरको लागि प्रत्यक्ष वायु गुणस्तर र सरल पूर्वानुमान।",
      tagline:
        "कुनै पनि भारतीय शहरको लागि प्रत्यक्ष वायु गुणस्तर र पारदर्शी 24 घण्टा पूर्वानुमान।",
      ui: {
        cityPlaceholder: "शहरको नाम लेख्नुहोस्",
        check: "AQI हेर्नुहोस्",
        pickCity: "प्रत्यक्ष AQI हेर्न शहर छान्नुहोस्",
        pickHint: "CPCB निगरानी केन्द्रहरू प्रत्येक घण्टा अपडेट हुन्छन्।",
        rightNow: "अहिले",
        next24h: "अर्को 24 घण्टा",
        stations: "केन्द्रहरू",
        worst: "सबैभन्दा खराब",
        forecastNote:
          "पूर्वानुमानले हालको पठनमा निश्चित दैनिक गुणक लागू गर्छ। मोडेल होइन — पारदर्शी नियमहरू।",
        dominant: "मुख्य प्रदूषक",
        averagedAcross: "औसत केन्द्रहरूमा",
        couldNotLoad: "AQI लोड भएन",
        listView: "सूची",
        mapView: "नक्सा",
      },
    },
    rivers: {
      title: "नदी स्वास्थ्य जाँच",
      description: "तपाईंको नजिकैको CPCB निगरानी केन्द्रहरूमा पानीको गुणस्तर।",
      tagline: "CPCB केन्द्र पठनहरू: घुलनशील अक्सिजन, BOD, pH, मल कोलिफर्म।",
      ui: {
        statePlaceholder: "राज्यको नाम लेख्नुहोस्",
        showStations: "केन्द्रहरू देखाउनुहोस्",
        pickState: "CPCB केन्द्रहरू हेर्न राज्य छान्नुहोस्",
        pickHint: "प्रत्येक केन्द्र CPCB तोकिएको प्रयोग वर्गहरू अनुसार दर्जा गरिएको।",
        noStations: "यसको लागि केन्द्र छैन",
        headlineIssue: "मुख्य समस्या",
        suitableFor: "उपयुक्त",
        openInMaps: "Google Maps मा खोल्नुहोस्",
        listView: "सूची",
        mapView: "नक्सा",
      },
    },
    rainfall: {
      title: "वर्षा असमानता",
      description: "के यो मनसुन असामान्य छ? जिल्लाको इतिहाससँग तुलना गर्नुहोस्।",
      tagline:
        "यस मौसमको वर्षा जिल्लाको दीर्घकालीन औसतसँग कसरी तुलना गर्छ।",
      ui: {
        districtPlaceholder: "जिल्लाको नाम लेख्नुहोस्",
        monsoon: "मनसुन (जुन-सेप्ट)",
        annual: "वार्षिक",
        currentMm: "हालको मिमि (वैकल्पिक)",
        compare: "तुलना गर्नुहोस्",
        pickDistrict: "जिल्लाको आधार हेर्न छान्नुहोस्",
        pickHint: "त्यसपछि यस मौसमको वर्षा थप्नुहोस्।",
        baseline: "आधार",
        thisSeason: "यो मौसम",
        meanRainfall: "औसत वर्षा",
        stdDeviation: "मानक विचलन",
        sampleYears: "वर्षहरूको संख्या",
        cov: "विचरण गुणांक",
        vsNormal: "सामान्यको तुलनामा",
        verdicts: {
          "much below": "धेरै कम",
          "below normal": "सामान्य भन्दा कम",
          normal: "सामान्य",
          "above normal": "सामान्य भन्दा बढी",
          "much above": "धेरै बढी",
        },
      },
    },
    solar: {
      title: "सौर्य ROI क्याल्कुलेटर",
      description: "पिनकोड अनुसार छाना सौर्य भुक्तानी अवधि।",
      tagline:
        "पिनकोड, छानाको क्षेत्र र हालको बिलको आधारमा छाना सौर्य भुक्तानी अनुमान।",
      ui: {
        pincode: "पिनकोड",
        roofSqft: "छाना क्षेत्र (वर्ग फिट)",
        monthlyBill: "मासिक बिल (₹)",
        calculate: "भुक्तानी अवधि निकाल्नुहोस्",
        fillForm: "तपाईंको भुक्तानी हेर्न फारम भर्नुहोस्",
        fillHint: "केवल अनुमान — स्थापना अघि व्यावसायिक कोट लिनुहोस्।",
        payback: "भुक्तानी अवधि",
        billOffset: "बिल कटौती",
        netSavings25: "25 वर्ष कुल बचत",
        capacity: "क्षमता",
        localGhi: "स्थानीय GHI",
        annualGen: "वार्षिक उत्पादन",
        installCost: "स्थापना लागत",
        annualSavings: "वार्षिक बचत",
        monthlySavings: "मासिक बचत",
        years: "वर्ष",
        couldNotCompute: "गणना गर्न सकिएन",
      },
    },
  },
  actions: { share: "WhatsApp मा सेयर गर्नुहोस्", tryAgain: "फेरि कोसिस गर्नुहोस्", backHome: "मुख्य पृष्ठ" },
  about: {
    heading: "GovPulse India बारेमा",
    intro:
      "भारतले data.gov.in र मन्त्रालय पोर्टलहरू मार्फत उपयोगी सार्वजनिक डाटा प्रकाशित गर्छ। धेरैजसो डाटा स्प्रेडशिट र PDF मा बसिरहेको छ। GovPulse यसलाई एक-क्लिक जवाफहरूमा बदल्छ।",
    footnote: "एउटै एप, डाटाबेस छैन, लगइन छैन। ₹0/महिना।",
    sourcesHeading: "डाटा स्रोतहरू",
    disclaimerHeading: "अस्वीकरण",
    disclaimerBody:
      "केवल अनुमान। आपतकालीन निर्णय, नियामक फाइलिङ, वा व्यावसायिक सल्लाहको लागि प्रयोग नगर्नुहोस्। मूल सरकारी स्रोतसँग क्रस-चेक गर्नुहोस्।",
    backLink: "← सबै उपकरणहरूमा फर्कनुहोस्",
  },
};

export const DICTS: Record<Locale, Dict> = { en, hi, kn, mr, ne };
