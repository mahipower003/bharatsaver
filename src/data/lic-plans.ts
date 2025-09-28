
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
            { value: "717", label: "LIC’s Single Premium Endowment Plan (717)" },
            { value: "714", label: "LIC’s New Endowment Plan (714)" },
            { value: "715", label: "LIC’s New Jeevan Anand (715)" },
            { value: "733", label: "LIC’s Jeevan Lakshya (733)" },
            { value: "736", label: "LIC’s Jeevan Labh Plan (736)" },
            { value: "774", label: "LIC’s Amritbaal (774)" },
            { value: "760", label: "LIC’s Bima Jyoti (760)" },
            { value: "768", label: "LIC’s Jeevan Azad (768)" },
            { value: "745", label: "LIC’s Jeevan Umang (745)" },
            { value: "771", label: "LIC’s Jeevan Utsav (771)" },
            { value: "748", label: "LIC’s Bima Shree (748)" },
            { value: "720", label: "LIC’s New Money Back Plan – 20 Years (720)" },
            { value: "721", label: "LIC’s New Money Back Plan – 25 Years (721)" },
            { value: "732", label: "LIC’s New Children’s Money Back Plan (732)" },
            { value: "734", label: "LIC’s Jeevan Tarun (734)" },
            { value: "764", label: "LIC’s Bima Ratna (764)" },
            { value: "876", label: "LIC’s Digi Term (876)" },
            { value: "878", label: "LIC’s Digi Credit Life (878)" },
            { value: "877", label: "LIC’s Yuva Credit Life (877)" },
            { value: "875", label: "LIC’s Yuva Term (875)" },
            { value: "954", label: "LIC’s New Tech-Term (954)" },
            { value: "955", label: "LIC’s New Jeevan Amar (955)" },
            { value: "859", label: "LIC’s Saral Jeevan Bima (859)" },
            { value: "rider_ab", label: "LIC’s Accident Benefit Rider" },
            { value: "rider_pwb", label: "LIC’s Premium Waiver Benefit Rider" },
            { value: "rider_addb", label: "LIC’s Accidental Death & Disability Benefit Rider" },
            { value: "rider_nta", label: "LIC’s New Term Assurance Rider" },
            { value: "rider_ladb", label: "LIC’s Linked Accidental Death Benefit Rider" }
        ]
    },
    {
        label: "Discontinued (Closed) LIC Plans",
        plans: [
            { value: "disc_js1", label: "LIC’s Jeevan Shree-I" },
            { value: "disc_jr", label: "LIC’s Jeevan Rekha" },
            { value: "disc_jc", label: "LIC’s Jeevan Chhaya" },
            { value: "disc_jk", label: "LIC’s Jeevan Kishore" },
            { value: "disc_ja", label: "LIC’s Jeevan Aadhar" },
            { value: "disc_kj", label: "LIC’s Komal Jeevan" },
            { value: "disc_jsa", label: "LIC’s Jeevan Saathi" },
            { value: "149", label: "LIC’s Jeevan Anand (149 - Old)" },
            { value: "165", label: "LIC’s Jeevan Saral (165)" },
            { value: "disc_jm", label: "LIC’s Jeevan Mitra" },
            { value: "disc_jan", label: "LIC’s Jeevan Anurag" },
            { value: "disc_jsh", label: "LIC’s Jeevan Shree (Original)" },
            { value: "disc_ast", label: "LIC’s Aadhar Stambh" },
            { value: "944", label: "LIC’s Aadhar Shila (944)" },
            { value: "disc_bl", label: "LIC’s Bhagya Lakshmi" },
            { value: "disc_bp", label: "LIC’s Bachat Plus" },
            { value: "853", label: "LIC’s Nav Jeevan (853)" },
            { value: "851", label: "LIC’s Micro Bachat (851)" },
            { value: "disc_jmn", label: "LIC’s Jeevan Mangal" },
            { value: "disc_njn", label: "LIC’s New Jeevan Nidhi" },
            { value: "disc_fp", label: "LIC’s Future Plus" },
            { value: "disc_nmb14", label: "LIC’s New Money Back Plan – 14 Years" },
            { value: "disc_sp", label: "LIC’s Samridhi Plus" },
            { value: "disc_jsu", label: "LIC’s Jeevan Surabhi" },
            { value: "disc_jmd", "label": "LIC’s Jeevan Madhur" },
            { value: "disc_ep", "label": "LIC’s Endowment Plus" },
            { value: "disc_mp", "label": "LIC’s Market Plus" },
            { value: "disc_pp", "label": "LIC’s Profit Plus" },
            { value: "disc_jbh", "label": "LIC’s Jeevan Bharti" },
            { value: "disc_cdea", label: "LIC’s Children’s Deferred Endowment Assurance" },
            { value: "disc_ba12", label: "LIC’s Bima Account – I & II" },
            { value: "disc_np", label: "LIC’s Nivesh Plus" },
            { value: "disc_bd", label: "LIC’s Bima Diamond" },
            { value: "disc_jshg", label: "LIC’s Jeevan Shagun" },
            { value: "disc_nbg", label: "LIC’s New Bima Gold" },
            { value: "disc_jd", label: "LIC’s Jeevan Deep" },
            { value: "disc_jp", label: "LIC’s Jeevan Pragati" },
            { value: "847", label: "LIC’s Jeevan Shiromani (847)" },
            { value: "855", label: "LIC’s Jeevan Amar (855 - Old)" }
        ]
    }
];
