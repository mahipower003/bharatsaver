
export type LicPlan = {
  value: string;
  label: string;
};

export type LicPlanGroup = {
  label: string;
  plans: LicPlan[];
};

export const licPlans: LicPlanGroup[] = [
    {
        label: "Active LIC Plans",
        plans: [
            { value: "jeevan-utsav-calculator", label: "LIC's Jeevan Utsav (871)" },
            { value: "lic-jeevan-anand-calculator", label: "LIC’s New Jeevan Anand (915)" },
            { value: "lic-single-premium-endowment-calculator", label: "LIC’s Single Premium Endowment Plan (917)" },
            { value: "new_endowment_plan", label: "LIC's New Endowment Plan (914)" },
            { value: "jeevan_lakshya", label: "LIC's Jeevan Lakshya (933)" },
            { value: "lic-jeevan-labh-calculator", label: "LIC's Jeevan Labh Plan (936)" },
            { value: "amritbaal", label: "LIC's Amritbaal (874)" },
            { value: "bima_jyoti", label: "LIC's Bima Jyoti (860)" },
            { value: "jeevan_azad", label: "LIC's Jeevan Azad (868)" },
            { value: "jeevan_umang", label: "LIC's Jeevan Umang (945)" },
            { value: "bima_shree", label: "LIC’s Bima Shree (948)" },
            { value: "new_money_back_20", "label": "LIC's New Money Back Plan- 20 Years (920)" },
            { value: "new_money_back_25", "label": "LIC's New Money Back Plan-25 years (921)" },
            { value: "new_childrens_money_back", "label": "LIC's New Children's Money Back Plan (932)" },
            { value: "bima_ratna", "label": "LIC's Bima Ratna (864)" },
            { value: "dhan_rekha", "label": "LIC's Dhan Rekha (863)" },
            { value: "new_tech_term", "label": "LIC's New Tech-Term (954)" },
            { value: "new_jeevan_amar", "label": "LIC's New Jeevan Amar (955)" },
            { value: "saral_jeevan_bima", "label": "LIC's Saral Jeevan Bima (859)" },
            { value: "new_pension_plus", "label": "LIC's New Pension Plus (867)" },
            { value: "jeevan_akshay_vii", "label": "LIC's Jeevan Akshay-VII (857)" },
            { value: "new_jeevan_shanti", "label": "LIC’s New Jeevan Shanti (858)" },
            { value: "saral_pension", "label": "LIC's Saral Pension (862)" },
            { value: "nivesh_plus", "label": "LIC's Nivesh Plus (849)" },
            { value: "siip", "label": "LIC's SIIP (852)" },
            { value: "index_plus", "label": "LIC's Index Plus (873)" },
            { value: "new_endowment_plus", "label": "LIC's New Endowment Plus (935)" },
            { value: "micro_bachat", "label": "LIC's Micro Bachat (951)" }
        ]
    }
];
