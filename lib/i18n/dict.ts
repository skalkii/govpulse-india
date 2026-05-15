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
    aqi: { title: string; description: string; tagline: string };
    rivers: { title: string; description: string; tagline: string };
    rainfall: { title: string; description: string; tagline: string };
    solar: { title: string; description: string; tagline: string };
  };
  common: {
    open: string;
    poweredBy: string;
  };
}

export const DICTS: Record<Locale, Dict> = {
  en: {
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
      },
      rivers: {
        title: "River Health Check",
        description: "Water quality at CPCB monitoring stations near you.",
        tagline: "CPCB station readings: dissolved oxygen, BOD, pH, fecal coliform.",
      },
      rainfall: {
        title: "Rainfall Anomaly",
        description: "Is this monsoon unusual? Compare to district history.",
        tagline:
          "How this season's rainfall compares to a district's long-period average.",
      },
      solar: {
        title: "Solar ROI Calculator",
        description: "Rooftop solar payback period by pincode.",
        tagline:
          "Rooftop solar payback estimate by pincode, roof area, and current bill.",
      },
    },
    common: { open: "Open", poweredBy: "Source" },
  },

  hi: {
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
      },
      rivers: {
        title: "नदी स्वास्थ्य जांच",
        description: "पास के CPCB निगरानी स्टेशनों पर पानी की गुणवत्ता।",
        tagline: "CPCB स्टेशन रीडिंग: घुलित ऑक्सीजन, BOD, pH, फीकल कोलीफॉर्म।",
      },
      rainfall: {
        title: "वर्षा विसंगति",
        description: "क्या यह मानसून असामान्य है? जिले के इतिहास से तुलना करें।",
        tagline:
          "इस मौसम की वर्षा जिले के दीर्घकालिक औसत से कैसी तुलना करती है।",
      },
      solar: {
        title: "सोलर ROI कैलकुलेटर",
        description: "पिनकोड के अनुसार छत पर सौर ऊर्जा की भुगतान अवधि।",
        tagline:
          "पिनकोड, छत क्षेत्र और वर्तमान बिल के अनुसार छत पर सौर भुगतान अनुमान।",
      },
    },
    common: { open: "खोलें", poweredBy: "स्रोत" },
  },

  kn: {
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
      },
      rivers: {
        title: "ನದಿ ಆರೋಗ್ಯ ತಪಾಸಣೆ",
        description: "ನಿಮ್ಮ ಹತ್ತಿರದ CPCB ಮೇಲ್ವಿಚಾರಣಾ ಕೇಂದ್ರಗಳಲ್ಲಿ ನೀರಿನ ಗುಣಮಟ್ಟ.",
        tagline: "CPCB ಕೇಂದ್ರ ಓದುಗಳು: ಕರಗಿದ ಆಮ್ಲಜನಕ, BOD, pH, ಫೀಕಲ್ ಕೋಲಿಫಾರ್ಮ್.",
      },
      rainfall: {
        title: "ಮಳೆಯ ವ್ಯತ್ಯಾಸ",
        description: "ಈ ಮುಂಗಾರು ಅಸಾಮಾನ್ಯವೇ? ಜಿಲ್ಲೆಯ ಇತಿಹಾಸದೊಂದಿಗೆ ಹೋಲಿಸಿ.",
        tagline:
          "ಈ ಋತುವಿನ ಮಳೆ ಜಿಲ್ಲೆಯ ದೀರ್ಘಕಾಲೀನ ಸರಾಸರಿಯೊಂದಿಗೆ ಹೇಗೆ ಹೋಲಿಸುತ್ತದೆ.",
      },
      solar: {
        title: "ಸೌರ ROI ಕ್ಯಾಲ್ಕುಲೇಟರ್",
        description: "ಪಿನ್‌ಕೋಡ್ ಪ್ರಕಾರ ಮೇಲ್ಛಾವಣಿಯ ಸೌರ ಮರಳುವ ಅವಧಿ.",
        tagline:
          "ಪಿನ್‌ಕೋಡ್, ಮೇಲ್ಛಾವಣಿ ಪ್ರದೇಶ ಮತ್ತು ಪ್ರಸ್ತುತ ಬಿಲ್‌ನ ಆಧಾರದ ಮೇಲೆ ಸೌರ ಮರಳುವ ಅಂದಾಜು.",
      },
    },
    common: { open: "ತೆರೆಯಿರಿ", poweredBy: "ಮೂಲ" },
  },

  mr: {
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
      },
      rivers: {
        title: "नदी आरोग्य तपासणी",
        description: "तुमच्या जवळच्या CPCB निरीक्षण केंद्रांवर पाण्याची गुणवत्ता.",
        tagline: "CPCB केंद्रावरील वाचने: विरघळलेला ऑक्सिजन, BOD, pH, मलमूत्र कोलिफॉर्म.",
      },
      rainfall: {
        title: "पावसाची विसंगती",
        description: "हा पावसाळा असामान्य आहे का? जिल्ह्याच्या इतिहासाशी तुलना करा.",
        tagline:
          "या हंगामातील पाऊस जिल्ह्याच्या दीर्घकालीन सरासरीशी कसा तुलनात्मक आहे.",
      },
      solar: {
        title: "सोलर ROI कॅल्क्युलेटर",
        description: "पिनकोडनुसार छतावरील सौर परतफेड कालावधी.",
        tagline:
          "पिनकोड, छताचे क्षेत्रफळ आणि सध्याच्या बिलानुसार छतावरील सौर परतफेड अंदाज.",
      },
    },
    common: { open: "उघडा", poweredBy: "स्रोत" },
  },

  ne: {
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
      },
      rivers: {
        title: "नदी स्वास्थ्य जाँच",
        description: "तपाईंको नजिकैको CPCB निगरानी केन्द्रहरूमा पानीको गुणस्तर।",
        tagline: "CPCB केन्द्र पठनहरू: घुलनशील अक्सिजन, BOD, pH, मल कोलिफर्म।",
      },
      rainfall: {
        title: "वर्षा असमानता",
        description: "के यो मनसुन असामान्य छ? जिल्लाको इतिहाससँग तुलना गर्नुहोस्।",
        tagline:
          "यस मौसमको वर्षा जिल्लाको दीर्घकालीन औसतसँग कसरी तुलना गर्छ।",
      },
      solar: {
        title: "सौर्य ROI क्याल्कुलेटर",
        description: "पिनकोड अनुसार छाना सौर्य भुक्तानी अवधि।",
        tagline:
          "पिनकोड, छानाको क्षेत्र र हालको बिलको आधारमा छाना सौर्य भुक्तानी अनुमान।",
      },
    },
    common: { open: "खोल्नुहोस्", poweredBy: "स्रोत" },
  },
};
