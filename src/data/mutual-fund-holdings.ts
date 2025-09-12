
export type FundPortfolio = {
    schemeCode: string;
    schemeName: string;
    holdings: {
        name: string;
        weight: number;
        sector: string;
    }[];
};

const rawData = [
  {
    "source" : "https://www.tickertape.in/mutualfunds/parag-parikh-flexi-cap-fund-M_PARO",
    "fetched_at_unix" : 1757655453,
    "fund_name" : "Parag Parikh Flexi Cap Fund Direct Growth",
    "coverage_pct" : 100.0771,
    "constituents_count" : 161,
    "constituents" : [ {
    "company" : "Clearing Corporation of India Ltd",
    "ticker" : "",
    "weight_pct" : 11.1243842248038
  }, {
    "company" : "HDFC Bank Ltd",
    "ticker" : "HDFCBANK",
    "weight_pct" : 7.92658807662777
  }, {
    "company" : "Bajaj Holdings and Investment Ltd",
    "ticker" : "BAJAJHLDNG",
    "weight_pct" : 5.90425404050109
  }, {
    "company" : "Power Grid Corporation of India Ltd",
    "ticker" : "POWERGRID",
    "weight_pct" : 5.88710158303669
  }, {
    "company" : "Coal India Ltd",
    "ticker" : "COALINDIA",
    "weight_pct" : 5.27924080272291
  }, {
    "company" : "ICICI Bank Ltd",
    "ticker" : "ICICIBANK",
    "weight_pct" : 4.94776927102049
  }, {
    "company" : "ITC Ltd",
    "ticker" : "ITC",
    "weight_pct" : 4.60972098771764
  }, {
    "company" : "Kotak Mahindra Bank Ltd",
    "ticker" : "KOTAKBANK",
    "weight_pct" : 3.98865254916201
  }, {
    "company" : "Maruti Suzuki India Ltd",
    "ticker" : "MARUTI",
    "weight_pct" : 3.53146465340373
  }, {
    "company" : "Bharti Airtel Ltd",
    "ticker" : "BHARTIARTL",
    "weight_pct" : 3.47533621314021
  }, {
    "company" : "Mahindra and Mahindra Ltd",
    "ticker" : "M&M",
    "weight_pct" : 3.43080260185574
  }, {
    "company" : "Facebook Inc",
    "ticker" : "",
    "weight_pct" : 3.34838054182986
  }, {
    "company" : "Alphabet Inc.",
    "ticker" : "",
    "weight_pct" : 3.08233777461519
  }, {
    "company" : "Axis Bank Ltd",
    "ticker" : "AXISBANK",
    "weight_pct" : 2.96595972154587
  }, {
    "company" : "Microsoft Corporation",
    "ticker" : "",
    "weight_pct" : 2.84836504896797
  }, {
    "company" : "Amazon.Com Inc",
    "ticker" : "",
    "weight_pct" : 2.41569999875018
  }, {
    "company" : "HCL Technologies Ltd",
    "ticker" : "HCLTECH",
    "weight_pct" : 2.36569177352956
  }, {
    "company" : "Dr Reddy's Laboratories Ltd",
    "ticker" : "DRREDDY",
    "weight_pct" : 1.27422300003117
  }, {
    "company" : "Zydus Lifesciences Ltd",
    "ticker" : "ZYDUSLIFE",
    "weight_pct" : 1.26096431609258
  }, {
    "company" : "Cipla Ltd",
    "ticker" : "CIPLA",
    "weight_pct" : 1.2422991683818
  }, {
    "company" : "Infosys Ltd",
    "ticker" : "INFY",
    "weight_pct" : 1.18887204762733
  }, {
    "company" : "Indian Energy Exchange Ltd",
    "ticker" : "IEX",
    "weight_pct" : 0.893335297657498
  }, {
    "company" : "Balkrishna Industries Ltd",
    "ticker" : "BALKRISIND",
    "weight_pct" : 0.833663048868273
  }, {
    "company" : "Zydus Wellness Ltd",
    "ticker" : "ZYDUSWELL",
    "weight_pct" : 0.772103110078455
  }, {
    "company" : "Reliance Industries Ltd",
    "ticker" : "RELIANCE",
    "weight_pct" : 0.73959330871579
  }, {
    "company" : "ICICI Bank Limited (14/11/2025)",
    "ticker" : "",
    "weight_pct" : 0.515537040407747
  }, {
    "company" : "Punjab National Bank (05/12/2025)",
    "ticker" : "",
    "weight_pct" : 0.513662563194043
  }, {
    "company" : "Multi Commodity Exchange of India Ltd",
    "ticker" : "MCX",
    "weight_pct" : 0.512442553562513
  }, {
    "company" : "Embassy Office Parks REIT",
    "ticker" : "",
    "weight_pct" : 0.458133913914316
  }, {
    "company" : "Parag Parikh Liquid Fund- Direct Plan- Growth",
    "ticker" : "",
    "weight_pct" : 0.443143398704692
  }, {
    "company" : "E I D-Parry (India) Ltd",
    "ticker" : "EIDPARRY",
    "weight_pct" : 0.433876019521455
  }, {
    "company" : "National Bank For Agriculture and Rural Development (22/01/2026)",
    "ticker" : "",
    "weight_pct" : 0.403262079224959
  }, {
    "company" : "Small Industries Dev Bank of India (05/05/2026) #",
    "ticker" : "",
    "weight_pct" : 0.395966621558734
  }, {
    "company" : "National Bank For Agriculture and Rural Development (25/06/2026)",
    "ticker" : "",
    "weight_pct" : 0.37192065331348
  }, {
    "company" : "HDFC Bank Limited (24/06/2026) #",
    "ticker" : "",
    "weight_pct" : 0.330740395185798
  }, {
    "company" : "Union Bank of India (25/06/2026)",
    "ticker" : "",
    "weight_pct" : 0.330736918136617
  }, {
    "company" : "Narayana Hrudayalaya Ltd",
    "ticker" : "NH",
    "weight_pct" : 0.304279529357819
  }, {
    "company" : "Central Depository Services (India) Ltd",
    "ticker" : "CDSL",
    "weight_pct" : 0.280398025538846
  }, {
    "company" : "Canara Bank (02/09/2025)",
    "ticker" : "",
    "weight_pct" : 0.260737485573658
  }, {
    "company" : "364 Days Tbill (MD 04/12/2025)",
    "ticker" : "",
    "weight_pct" : 0.257143433687284
  }, {
    "company" : "Kotak Mahindra Bank Limited (11/12/2025)",
    "ticker" : "",
    "weight_pct" : 0.256632829014992
  }, {
    "company" : "Canara Bank (12/12/2025)",
    "ticker" : "",
    "weight_pct" : 0.256557203195296
  }, {
    "company" : "Indian Bank (06/03/2026)",
    "ticker" : "",
    "weight_pct" : 0.252941767456456
  }, {
    "company" : "Axis Bank Limited (11/06/2026)",
    "ticker" : "",
    "weight_pct" : 0.248597194504273
  }, {
    "company" : "Bajaj Finance Limited (18/06/2026)",
    "ticker" : "",
    "weight_pct" : 0.247701158930221
  }, {
    "company" : "Indian Bank (28/07/2026)",
    "ticker" : "",
    "weight_pct" : 0.246619970487259
  }, {
    "company" : "Bank of Baroda (09/01/2026)",
    "ticker" : "",
    "weight_pct" : 0.21272047949301
  }, {
    "company" : "Bank of Baroda (13/01/2026) #",
    "ticker" : "",
    "weight_pct" : 0.212582266788048
  }, {
    "company" : "Bank of Baroda (25/05/2026)",
    "ticker" : "",
    "weight_pct" : 0.207790632237364
  }, {
    "company" : "Axis Bank Limited (11/08/2026)",
    "ticker" : "",
    "weight_pct" : 0.204944232851224
  }, {
    "company" : "Bank of Baroda (12/09/2025) #",
    "ticker" : "",
    "weight_pct" : 0.195246047274409
  }, {
    "company" : "Bajaj Finance Ltd",
    "ticker" : "BAJFINANCE",
    "weight_pct" : 0.194814806249684
  }, {
    "company" : "National Bank For Agriculture and Rural Development (20/01/2026)",
    "ticker" : "",
    "weight_pct" : 0.191081324691135
  }, {
    "company" : "HDFC Bank Limited (19/05/2026)",
    "ticker" : "",
    "weight_pct" : 0.187151824484983
  }, {
    "company" : "Bank of Baroda (23/07/2026)",
    "ticker" : "",
    "weight_pct" : 0.185140786164679
  }, {
    "company" : "Union Bank of India (26/11/2025)",
    "ticker" : "",
    "weight_pct" : 0.171508754070236
  }, {
    "company" : "Kotak Mahindra Bank Limited (04/12/2025)",
    "ticker" : "",
    "weight_pct" : 0.171277182594753
  }, {
    "company" : "Punjab National Bank (08/01/2026)",
    "ticker" : "",
    "weight_pct" : 0.170201209725563
  }, {
    "company" : "Union Bank of India (16/01/2026) #",
    "ticker" : "",
    "weight_pct" : 0.16999223906976
  }, {
    "company" : "364 Days Tbill (MD 29/01/2026)",
    "ticker" : "",
    "weight_pct" : 0.169975549233689
  }, {
    "company" : "Canara Bank (04/03/2026)",
    "ticker" : "",
    "weight_pct" : 0.168682434643119
  }, {
    "company" : "Punjab National Bank (18/03/2026) #",
    "ticker" : "",
    "weight_pct" : 0.168283964806929
  }, {
    "company" : "Indian Bank (06/05/2026)",
    "ticker" : "",
    "weight_pct" : 0.166754584724481
  }, {
    "company" : "Bajaj Finance Limited (06/05/2026)",
    "ticker" : "",
    "weight_pct" : 0.16637124005223
  }, {
    "company" : "Bajaj Finance Limited (26/05/2026)",
    "ticker" : "",
    "weight_pct" : 0.165793528330737
  }, {
    "company" : "ICRA Ltd",
    "ticker" : "ICRA",
    "weight_pct" : 0.156137415049017
  }, {
    "company" : "Tata Consultancy Services Ltd",
    "ticker" : "TCS",
    "weight_pct" : 0.153772326195815
  }, {
    "company" : "HDFC Bank Limited (24/03/2026) #",
    "ticker" : "",
    "weight_pct" : 0.147097695660933
  }, {
    "company" : "Axis Bank Limited (25/06/2026)",
    "ticker" : "",
    "weight_pct" : 0.144680711848699
  }, {
    "company" : "Jio Financial Services Ltd",
    "ticker" : "JIOFIN",
    "weight_pct" : 0.136642295698634
  }, {
    "company" : "Small Industries Dev Bank of India (13/01/2026)",
    "ticker" : "",
    "weight_pct" : 0.127526428933478
  }, {
    "company" : "Small Industries Dev Bank of India (09/07/2026)",
    "ticker" : "",
    "weight_pct" : 0.123641695735537
  }, {
    "company" : "Maharashtra Scooters Ltd",
    "ticker" : "MAHSCOOTER",
    "weight_pct" : 0.110622667411777
  }, {
    "company" : "Union Bank of India (18/12/2025)",
    "ticker" : "",
    "weight_pct" : 0.106798695648282
  }, {
    "company" : "364 Days Tbill (MD 21/11/2025)",
    "ticker" : "",
    "weight_pct" : 0.0944729909312977
  }, {
    "company" : "364 Days Tbill (MD 30/07/2026)",
    "ticker" : "",
    "weight_pct" : 0.0909915954384015
  }, {
    "company" : "Larsen and Toubro Ltd",
    "ticker" : "LT",
    "weight_pct" : 0.0893989330608523
  }, {
    "company" : "Brookfield India Real Estate Trust",
    "ticker" : "",
    "weight_pct" : 0.0870477524043765
  }, {
    "company" : "HDFC Bank Limited (10/10/2025)",
    "ticker" : "",
    "weight_pct" : 0.0863894600681042
  }, {
    "company" : "HDFC Bank Limited (31/10/2025)",
    "ticker" : "",
    "weight_pct" : 0.0861032119942439
  }, {
    "company" : "Kotak Mahindra Bank Limited (26/11/2025)",
    "ticker" : "",
    "weight_pct" : 0.0857577671580699
  }, {
    "company" : "Canara Bank (04/12/2025)",
    "ticker" : "",
    "weight_pct" : 0.0856273778137666
  }, {
    "company" : "Union Bank of India (05/12/2025)",
    "ticker" : "",
    "weight_pct" : 0.0856152081416317
  }, {
    "company" : "Axis Bank Limited (08/01/2026)",
    "ticker" : "",
    "weight_pct" : 0.0851064289201605
  }, {
    "company" : "Union Bank of India (10/01/2026)",
    "ticker" : "",
    "weight_pct" : 0.0850788733053977
  }, {
    "company" : "Kotak Mahindra Bank Limited (15/01/2026) #",
    "ticker" : "",
    "weight_pct" : 0.0850161125676731
  }, {
    "company" : "Punjab National Bank (16/01/2026)",
    "ticker" : "",
    "weight_pct" : 0.0849898608463534
  }, {
    "company" : "Indian Bank (19/01/2026)",
    "ticker" : "",
    "weight_pct" : 0.0849548295758506
  }, {
    "company" : "Canara Bank (30/01/2026)",
    "ticker" : "",
    "weight_pct" : 0.0848036648626884
  }, {
    "company" : "Canara Bank (03/02/2026)",
    "ticker" : "",
    "weight_pct" : 0.0847436857643089
  }, {
    "company" : "Kotak Mahindra Bank Limited (13/03/2026)",
    "ticker" : "",
    "weight_pct" : 0.0842316902723449
  }, {
    "company" : "364 Days Tbill (MD 16/04/2026)",
    "ticker" : "",
    "weight_pct" : 0.0840105499444066
  }, {
    "company" : "Bajaj Finance Limited (07/05/2026)",
    "ticker" : "",
    "weight_pct" : 0.0831711033457824
  }, {
    "company" : "Axis Bank Limited (12/06/2026)",
    "ticker" : "",
    "weight_pct" : 0.0828520840833872
  }, {
    "company" : "Tata Motors Ltd",
    "ticker" : "TATAMOTORS",
    "weight_pct" : 0.0726222576867331
  }, {
    "company" : "Hindalco Industries Ltd",
    "ticker" : "HINDALCO",
    "weight_pct" : 0.0707621233009032
  }, {
    "company" : "Axis Bank Limited (04/02/2026)",
    "ticker" : "",
    "weight_pct" : 0.0635474201019169
  }, {
    "company" : "Sun Pharmaceutical Industries Ltd",
    "ticker" : "SUNPHARMA",
    "weight_pct" : 0.0613668756340193
  }, {
    "company" : "NTPC Ltd",
    "ticker" : "NTPC",
    "weight_pct" : 0.049371664441729
  }, {
    "company" : "Indian Bank (06/11/2025)",
    "ticker" : "",
    "weight_pct" : 0.0430120545626833
  }, {
    "company" : "364 Days Tbill (MD 27/11/2025)",
    "ticker" : "",
    "weight_pct" : 0.0429034837019935
  }, {
    "company" : "Indian Bank (04/12/2025)",
    "ticker" : "",
    "weight_pct" : 0.0428136889068833
  }, {
    "company" : "Indian Bank (08/01/2026) #",
    "ticker" : "",
    "weight_pct" : 0.042553257923195
  }, {
    "company" : "Union Bank of India (29/01/2026)",
    "ticker" : "",
    "weight_pct" : 0.042408786529707
  }, {
    "company" : "Hindustan Unilever Ltd",
    "ticker" : "HINDUNILVR",
    "weight_pct" : 0.0370392664050705
  }, {
    "company" : "Steel Authority of India Ltd",
    "ticker" : "SAIL",
    "weight_pct" : 0.0344685100927881
  }, {
    "company" : "Mindspace Business Parks REIT",
    "ticker" : "",
    "weight_pct" : 0.0320141480018536
  }, {
    "company" : "DLF Ltd",
    "ticker" : "DLF",
    "weight_pct" : 0.0312702333294889
  }, {
    "company" : "Bharat Electronics Ltd",
    "ticker" : "BEL",
    "weight_pct" : 0.0262648471803766
  }, {
    "company" : "IPCA Laboratories Ltd",
    "ticker" : "IPCALAB",
    "weight_pct" : 0.0262432894754518
  }, {
    "company" : "Grasim Industries Ltd",
    "ticker" : "GRASIM",
    "weight_pct" : 0.0231018624662689
  }, {
    "company" : "Divi's Laboratories Ltd",
    "ticker" : "DIVISLAB",
    "weight_pct" : 0.0204134080391954
  }, {
    "company" : "Lupin Ltd",
    "ticker" : "LUPIN",
    "weight_pct" : 0.019811270047203
  }, {
    "company" : "Nesco Ltd",
    "ticker" : "NESCO",
    "weight_pct" : 0.0185205024648306
  }, {
    "company" : "Oil and Natural Gas Corporation Ltd",
    "ticker" : "ONGC",
    "weight_pct" : 0.01768974848916
  }, {
    "company" : "Swaraj Engines Ltd",
    "ticker" : "SWARAJENG",
    "weight_pct" : 0.0164917311937019
  }, {
    "company" : "Tata Consumer Products Ltd",
    "ticker" : "TATACONSUM",
    "weight_pct" : 0.0143640378733618
  }, {
    "company" : "GMR Airports Ltd",
    "ticker" : "GMRAIRPORT",
    "weight_pct" : 0.0126809722170957
  }, {
    "company" : "Bandhan Bank Ltd",
    "ticker" : "BANDHANBNK",
    "weight_pct" : 0.0125569284875486
  }, {
    "company" : "Eicher Motors Ltd",
    "ticker" : "EICHERMOT",
    "weight_pct" : 0.0113264007822443
  }, {
    "company" : "Varun Beverages Ltd",
    "ticker" : "VBL",
    "weight_pct" : 0.0103737762327649
  }, {
    "company" : "Bajaj Finserv Ltd",
    "ticker" : "BAJAJFINSV",
    "weight_pct" : 0.0101463772163001
  }, {
    "company" : "Vedanta Ltd",
    "ticker" : "VEDL",
    "weight_pct" : 0.00996591836378438
  }, {
    "company" : "Punjab National Bank",
    "ticker" : "PNB",
    "weight_pct" : 0.00982144697029641
  }, {
    "company" : "Indusind Bank Ltd",
    "ticker" : "INDUSINDBK",
    "weight_pct" : 0.00940446184721468
  }, {
    "company" : "NMDC Ltd",
    "ticker" : "NMDC",
    "weight_pct" : 0.00839663914198026
  }, {
    "company" : "Hindustan Petroleum Corp Ltd",
    "ticker" : "HINDPETRO",
    "weight_pct" : 0.00760934828107736
  }, {
    "company" : "Gail (India) Ltd",
    "ticker" : "GAIL",
    "weight_pct" : 0.00649234623154637
  }, {
    "company" : "Indian Railway Catering and Tourism Corporation Ltd",
    "ticker" : "IRCTC",
    "weight_pct" : 0.00610508987896578
  }, {
    "company" : "Titan Company Ltd",
    "ticker" : "TITAN",
    "weight_pct" : 0.0060169466822168
  }, {
    "company" : "Tata Chemicals Ltd",
    "ticker" : "TATACHEM",
    "weight_pct" : 0.00561830299356706
  }, {
    "company" : "Tata Steel Ltd",
    "ticker" : "TATASTEEL",
    "weight_pct" : 0.00561308741979493
  }, {
    "company" : "IIFL Finance Ltd",
    "ticker" : "IIFL",
    "weight_pct" : 0.00453841844404772
  }, {
    "company" : "Asian Paints Ltd",
    "ticker" : "ASIANPAINT",
    "weight_pct" : 0.0038860370913839
  }, {
    "company" : "State Bank of India",
    "ticker" : "SBIN",
    "weight_pct" : 0.00303450774685428
  }, {
    "company" : "LIC Housing Finance Ltd",
    "ticker" : "LICHSGFIN",
    "weight_pct" : 0.00299217467307049
  }, {
    "company" : "Tata Power Company Ltd",
    "ticker" : "TATAPOWER",
    "weight_pct" : 0.0029238506566556
  }, {
    "company" : "JSW Steel Ltd",
    "ticker" : "JSWSTEEL",
    "weight_pct" : 0.0024094212302646
  }, {
    "company" : "Polycab India Ltd",
    "ticker" : "POLYCAB",
    "weight_pct" : 0.00231145536957811
  }, {
    "company" : "Bharat Heavy Electricals Ltd",
    "ticker" : "BHEL",
    "weight_pct" : 0.00213586438591642
  }, {
    "company" : "Tech Mahindra Ltd",
    "ticker" : "TECHM",
    "weight_pct" : 0.00208614258262213
  }, {
    "company" : "Godrej Properties Ltd",
    "ticker" : "GODREJPROP",
    "weight_pct" : 0.00144332311520721
  }, {
    "company" : "PI Industries Ltd",
    "ticker" : "PIIND",
    "weight_pct" : 0.000730701885475294
  }, {
    "company" : "Jindal Steel Ltd",
    "ticker" : "JINDALSTEL",
    "weight_pct" : 0.000719401475635681
  }, {
    "company" : "Indus Towers Ltd",
    "ticker" : "INDUSTOWER",
    "weight_pct" : 0.000550416885418696
  }, {
    "company" : "Indian Hotels Company Ltd",
    "ticker" : "INDHOTEL",
    "weight_pct" : 0.000527468360821328
  }, {
    "company" : "United Spirits Ltd",
    "ticker" : "UNITDSPR",
    "weight_pct" : 0.000182371229565449
  }, {
    "company" : "Motilal Oswal Financial Services Ltd",
    "ticker" : "MOTILALOFS",
    "weight_pct" : 0
  }, {
    "company" : "Hindustan Copper Ltd",
    "ticker" : "HINDCOPPER",
    "weight_pct" : 0
  }, {
    "company" : "ICICI Bank Limited (25/07/2025)",
    "ticker" : "",
    "weight_pct" : 0
  }, {
    "company" : "Tata Communications Ltd",
    "ticker" : "TATACOMM",
    "weight_pct" : 0
  }, {
    "company" : "Interglobe Aviation Ltd",
    "ticker" : "INDIGO",
    "weight_pct" : 0
  }, {
    "company" : "Axis Bank Limited (10/10/2025)",
    "ticker" : "",
    "weight_pct" : 0
  }, {
    "company" : "Axis Bank Limited (13/11/2025)",
    "ticker" : "",
    "weight_pct" : 0
  }, {
    "company" : "Aurobindo Pharma Ltd",
    "ticker" : "AUROPHARMA",
    "weight_pct" : 0
  }, {
    "company" : "RBL Bank Ltd",
    "ticker" : "RBLBANK",
    "weight_pct" : 0
  }, {
    "company" : "Mahanagar Gas Ltd",
    "ticker" : "MGL",
    "weight_pct" : 0
  }, {
    "company" : "Bank of Baroda (12/12/2025) #",
    "ticker" : "",
    "weight_pct" : 0
  }, {
    "company" : "Axis Bank Limited (07/01/2026)",
    "ticker" : "",
    "weight_pct" : 0
  }, {
    "company" : "Small Industries Dev Bank of India (06/02/2026)",
    "ticker" : "",
    "weight_pct" : 0
  }, {
    "company" : "Net Receivables / (Payables)",
    "ticker" : "",
    "weight_pct" : null
  } ]
}, {
  "source" : "https://www.tickertape.in/mutualfunds/hdfc-balanced-advantage-fund-M_HDCBA",
  "fetched_at_unix" : 1757655454,
  "fund_name" : "HDFC Balanced Advantage Fund Direct Growth",
  "coverage_pct" : 100.0,
  "constituents_count" : 297,
  "constituents" : [ {
    "company" : "HDFC Bank Ltd",
    "ticker" : "HDFCBANK",
    "weight_pct" : 5.25403333544117
  }, {
    "company" : "TREPS - Tri-party Repo",
    "ticker" : "",
    "weight_pct" : 4.80282025085333
  }, {
    "company" : "ICICI Bank Ltd",
    "ticker" : "ICICIBANK",
    "weight_pct" : 3.96873091436185
  }, {
    "company" : "Reliance Industries Ltd",
    "ticker" : "RELIANCE",
    "weight_pct" : 3.2769544619962
  }, {
    "company" : "Bharti Airtel Ltd",
    "ticker" : "BHARTIARTL",
    "weight_pct" : 3.13076255595389
  }, {
    "company" : "State Bank of India",
    "ticker" : "SBIN",
    "weight_pct" : 2.77875049297037
  }, {
    "company" : "Infosys Ltd",
    "ticker" : "INFY",
    "weight_pct" : 2.67724762222605
  }, {
    "company" : "Larsen and Toubro Ltd",
    "ticker" : "LT",
    "weight_pct" : 2.34382378003019
  }, {
    "company" : "7.18% GOI MAT 140833",
    "ticker" : "",
    "weight_pct" : 2.3288850590889
  }, {
    "company" : "NTPC Ltd",
    "ticker" : "NTPC",
    "weight_pct" : 2.22253699723134
  }, {
    "company" : "Axis Bank Ltd",
    "ticker" : "AXISBANK",
    "weight_pct" : 2.05023141552824
  }, {
    "company" : "Coal India Ltd",
    "ticker" : "COALINDIA",
    "weight_pct" : 1.94668352292578
  }, {
    "company" : "ITC Ltd",
    "ticker" : "ITC",
    "weight_pct" : 1.68136491377357
  }, {
    "company" : "5.38% Floating Rate GOI 2034^",
    "ticker" : "",
    "weight_pct" : 1.51462751770451
  }, {
    "company" : "HCL Technologies Ltd",
    "ticker" : "HCLTECH",
    "weight_pct" : 1.42084024899654
  }, {
    "company" : "Tata Consultancy Services Ltd",
    "ticker" : "TCS",
    "weight_pct" : 1.37606514292227
  }, {
    "company" : "Kotak Mahindra Bank Ltd",
    "ticker" : "KOTAKBANK",
    "weight_pct" : 1.22693891593216
  }, {
    "company" : "Maruti Suzuki India Ltd",
    "ticker" : "MARUTI",
    "weight_pct" : 1.20082375629247
  }, {
    "company" : "7.1% GOI MAT 080434",
    "ticker" : "",
    "weight_pct" : 1.12916815319306
  }, {
    "company" : "Sun Pharmaceutical Industries Ltd",
    "ticker" : "SUNPHARMA",
    "weight_pct" : 1.07025537798851
  }, {
    "company" : "Lupin Ltd",
    "ticker" : "LUPIN",
    "weight_pct" : 1.05554331009143
  }, {
    "company" : "7.18% GOI MAT 240737",
    "ticker" : "",
    "weight_pct" : 0.98532103274698
  }, {
    "company" : "Interglobe Aviation Ltd",
    "ticker" : "INDIGO",
    "weight_pct" : 0.98363612310227
  }, {
    "company" : "Hyundai Motor India Ltd",
    "ticker" : "HYUNDAI",
    "weight_pct" : 0.967094111355849
  }, {
    "company" : "Mahindra and Mahindra Ltd",
    "ticker" : "M&M",
    "weight_pct" : 0.922554463267279
  }, {
    "company" : "SBI Life Insurance Company Ltd",
    "ticker" : "SBILIFE",
    "weight_pct" : 0.882156501360736
  }, {
    "company" : "Net Current Assets",
    "ticker" : "",
    "weight_pct" : 0.789497650209437
  }, {
    "company" : "7.34% GOI MAT 220464",
    "ticker" : "",
    "weight_pct" : 0.78039294498939
  }, {
    "company" : "Embassy Office Parks REIT",
    "ticker" : "",
    "weight_pct" : 0.747540224341321
  }, {
    "company" : "Eternal Ltd",
    "ticker" : "ETERNAL",
    "weight_pct" : 0.729114647641249
  }, {
    "company" : "Power Finance Corporation Ltd",
    "ticker" : "PFC",
    "weight_pct" : 0.694942372954009
  }, {
    "company" : "Bank of Baroda Ltd",
    "ticker" : "BANKBARODA",
    "weight_pct" : 0.691029615250511
  }, {
    "company" : "7.57% LIC Housing Finance Ltd.^",
    "ticker" : "",
    "weight_pct" : 0.652013435565075
  }, {
    "company" : "Techno Electric & Engineering Company Ltd",
    "ticker" : "TECHNOE",
    "weight_pct" : 0.64351360014526
  }, {
    "company" : "Bharat Petroleum Corporation Ltd",
    "ticker" : "BPCL",
    "weight_pct" : 0.640262400236031
  }, {
    "company" : "7.33% State Bank of India (Tier 2 - Basel III)^",
    "ticker" : "",
    "weight_pct" : 0.608327273208693
  }, {
    "company" : "Hindustan Petroleum Corp Ltd",
    "ticker" : "HINDPETRO",
    "weight_pct" : 0.608276718994117
  }, {
    "company" : "REC Limited",
    "ticker" : "RECLTD",
    "weight_pct" : 0.588644964242944
  }, {
    "company" : "Gail (India) Ltd",
    "ticker" : "GAIL",
    "weight_pct" : 0.582153051208722
  }, {
    "company" : "Tata Steel Ltd",
    "ticker" : "TATASTEEL",
    "weight_pct" : 0.5807619693865
  }, {
    "company" : "6.9% GOI MAT 150465",
    "ticker" : "",
    "weight_pct" : 0.5802233839772
  }, {
    "company" : "Bajaj Finserv Ltd",
    "ticker" : "BAJAJFINSV",
    "weight_pct" : 0.547284394688993
  }, {
    "company" : "7.42% State Bank of India (Tier 2 - Basel III)^",
    "ticker" : "",
    "weight_pct" : 0.546044777646646
  }, {
    "company" : "Divi's Laboratories Ltd",
    "ticker" : "DIVISLAB",
    "weight_pct" : 0.539181672023207
  }, {
    "company" : "7.96% Pipeline Infrastructure Pvt. Ltd.^",
    "ticker" : "",
    "weight_pct" : 0.524015110854579
  }, {
    "company" : "Bajaj Finance Ltd",
    "ticker" : "BAJFINANCE",
    "weight_pct" : 0.507731608232791
  }, {
    "company" : "AU Small Finance Bank Ltd",
    "ticker" : "AUBANK",
    "weight_pct" : 0.499179338891792
  }, {
    "company" : "BROOKFIELD INDIA REAL ESTATE TRUST",
    "ticker" : "",
    "weight_pct" : 0.492068804519517
  }, {
    "company" : "Indusind Bank Ltd",
    "ticker" : "INDUSINDBK",
    "weight_pct" : 0.490813655164668
  }, {
    "company" : "Vishal Mega Mart Ltd",
    "ticker" : "VMM",
    "weight_pct" : 0.478558660600691
  }, {
    "company" : "7.5% Cholamandalam Investment & Finance Co. Ltd.",
    "ticker" : "",
    "weight_pct" : 0.42681389921786
  }, {
    "company" : "Hindustan Aeronautics Ltd",
    "ticker" : "HAL",
    "weight_pct" : 0.422495322750779
  }, {
    "company" : "Apollo Tyres Ltd",
    "ticker" : "APOLLOTYRE",
    "weight_pct" : 0.411537028950891
  }, {
    "company" : "7.26 GOI 2032",
    "ticker" : "",
    "weight_pct" : 0.409971530141785
  }, {
    "company" : "BEML Ltd",
    "ticker" : "BEML",
    "weight_pct" : 0.407010299709899
  }, {
    "company" : "Jindal Steel Ltd",
    "ticker" : "JINDALSTEL",
    "weight_pct" : 0.403642063331308
  }, {
    "company" : "Small Industries Development Bank^",
    "ticker" : "",
    "weight_pct" : 0.401127411616833
  }, {
    "company" : "Apar Industries Ltd",
    "ticker" : "APARINDS",
    "weight_pct" : 0.399190918082364
  }, {
    "company" : "6.9% REC Limited.^",
    "ticker" : "",
    "weight_pct" : 0.392869761553736
  }, {
    "company" : "7.83% Small Industries Development Bank",
    "ticker" : "",
    "weight_pct" : 0.38104907814825
  }, {
    "company" : "7.26% GOI MAT 060233",
    "ticker" : "",
    "weight_pct" : 0.364068600102413
  }, {
    "company" : "7.8% HDFC Bank Ltd.£^",
    "ticker" : "",
    "weight_pct" : 0.356489326261133
  }, {
    "company" : "7.44% Indian Railways Finance Corp. Ltd.",
    "ticker" : "",
    "weight_pct" : 0.352726846154389
  }, {
    "company" : "Housing and Urban Development Corporation Ltd.^",
    "ticker" : "",
    "weight_pct" : 0.347431811570152
  }, {
    "company" : "7.55% Bajaj Finance Ltd.",
    "ticker" : "",
    "weight_pct" : 0.34476727798663
  }, {
    "company" : "Titagarh Rail Systems Ltd",
    "ticker" : "TITAGARH",
    "weight_pct" : 0.3430068832818
  }, {
    "company" : "IPCA Laboratories Ltd",
    "ticker" : "IPCALAB",
    "weight_pct" : 0.342009352664244
  }, {
    "company" : "Gujarat Pipavav Port Ltd",
    "ticker" : "GPPL",
    "weight_pct" : 0.339290010793295
  }, {
    "company" : "Bajaj Auto Ltd",
    "ticker" : "BAJAJ-AUTO",
    "weight_pct" : 0.334558195668123
  }, {
    "company" : "Hexaware Technologies Ltd",
    "ticker" : "HEXT",
    "weight_pct" : 0.332335887797234
  }, {
    "company" : "Hindustan Unilever Ltd",
    "ticker" : "HINDUNILVR",
    "weight_pct" : 0.320350581665613
  }, {
    "company" : "HDFC Bank Ltd.£^",
    "ticker" : "",
    "weight_pct" : 0.306629811674708
  }, {
    "company" : "J Kumar Infraprojects Ltd",
    "ticker" : "JKIL",
    "weight_pct" : 0.302917786850614
  }, {
    "company" : "Oil and Natural Gas Corporation Ltd",
    "ticker" : "ONGC",
    "weight_pct" : 0.302215568034446
  }, {
    "company" : "7.82% Bajaj Finance Ltd.",
    "ticker" : "",
    "weight_pct" : 0.301094867168069
  }, {
    "company" : "7.75% HDFC Bank Ltd.£^",
    "ticker" : "",
    "weight_pct" : 0.299954083120559
  }, {
    "company" : "Bharat Dynamics Ltd",
    "ticker" : "BDL",
    "weight_pct" : 0.29827679123421
  }, {
    "company" : "7.4% National Bank for Agri & Rural Dev.^",
    "ticker" : "",
    "weight_pct" : 0.297809931471813
  }, {
    "company" : "Britannia Industries Ltd",
    "ticker" : "BRITANNIA",
    "weight_pct" : 0.288576021155413
  }, {
    "company" : "Jamnagar Utilities & Power Pvt. Ltd. (erstwhile Reliance Utilities & Power Pvt. Ltd.)",
    "ticker" : "",
    "weight_pct" : 0.287917431318948
  }, {
    "company" : "Aurobindo Pharma Ltd",
    "ticker" : "AUROPHARMA",
    "weight_pct" : 0.276837748044921
  }, {
    "company" : "Trent Ltd",
    "ticker" : "TRENT",
    "weight_pct" : 0.275939446149909
  }, {
    "company" : "United Spirits Ltd",
    "ticker" : "UNITDSPR",
    "weight_pct" : 0.275515621775654
  }, {
    "company" : "Time Technoplast Ltd",
    "ticker" : "TIMETECHNO",
    "weight_pct" : 0.271152624873456
  }, {
    "company" : "Adani Energy Solutions Ltd",
    "ticker" : "ADANIENSOL",
    "weight_pct" : 0.263751527432277
  }, {
    "company" : "Tata Motors Ltd",
    "ticker" : "TATAMOTORS",
    "weight_pct" : 0.258398320875103
  }, {
    "company" : "7.89% Bajaj Housing Finance Ltd.",
    "ticker" : "",
    "weight_pct" : 0.25509280733808
  }, {
    "company" : "Ashoka Buildcon Ltd",
    "ticker" : "ASHOKA",
    "weight_pct" : 0.253565694116558
  }, {
    "company" : "7.73% LIC Housing Finance Ltd.",
    "ticker" : "",
    "weight_pct" : 0.252589829590963
  }, {
    "company" : "7.53% National Bank for Agri & Rural Dev.",
    "ticker" : "",
    "weight_pct" : 0.251292832031093
  }, {
    "company" : "7.66% Bajaj Housing Finance Ltd.",
    "ticker" : "",
    "weight_pct" : 0.250637408016285
  }, {
    "company" : "HDB Financial Services Ltd.^",
    "ticker" : "",
    "weight_pct" : 0.250216452667906
  }, {
    "company" : "7.57% Bajaj Finance Ltd.^",
    "ticker" : "",
    "weight_pct" : 0.249271850631168
  }, {
    "company" : "7.75% Bank of Baroda (Tier 2 - Basel III)",
    "ticker" : "",
    "weight_pct" : 0.248586252378697
  }, {
    "company" : "7.54% Small Industries Development Bank^",
    "ticker" : "",
    "weight_pct" : 0.248239001315757
  }, {
    "company" : "Punjab National Bank^",
    "ticker" : "",
    "weight_pct" : 0.248161339753248
  }, {
    "company" : "7.09% GOI MAT 050854",
    "ticker" : "",
    "weight_pct" : 0.247365333470508
  }, {
    "company" : "India Universal Trust AL2 (PTC backed by loan receivables originated by HDFC Bank Limited) £^",
    "ticker" : "",
    "weight_pct" : 0.241965826771609
  }, {
    "company" : "Godrej Properties Ltd",
    "ticker" : "GODREJPROP",
    "weight_pct" : 0.240862142196635
  }, {
    "company" : "Kalpataru Projects International Ltd",
    "ticker" : "KPIL",
    "weight_pct" : 0.240534281791341
  }, {
    "company" : "Tega Industries Ltd",
    "ticker" : "TEGA",
    "weight_pct" : 0.232843313804745
  }, {
    "company" : "PCBL Chemical Ltd",
    "ticker" : "PCBL",
    "weight_pct" : 0.230776427990801
  }, {
    "company" : "Mishra Dhatu Nigam Ltd",
    "ticker" : "MIDHANI",
    "weight_pct" : 0.230517622070388
  }, {
    "company" : "NHPC Ltd",
    "ticker" : "NHPC",
    "weight_pct" : 0.228293632356744
  }, {
    "company" : "Cipla Ltd",
    "ticker" : "CIPLA",
    "weight_pct" : 0.226591508556778
  }, {
    "company" : "Dynamatic Technologies Ltd",
    "ticker" : "DYNAMATECH",
    "weight_pct" : 0.223811422482796
  }, {
    "company" : "Bosch Ltd",
    "ticker" : "BOSCHLTD",
    "weight_pct" : 0.221749582197117
  }, {
    "company" : "HDFC Life Insurance Company Ltd",
    "ticker" : "HDFCLIFE",
    "weight_pct" : 0.213159817655875
  }, {
    "company" : "POWERGRID Infrastructure Investment Trust",
    "ticker" : "",
    "weight_pct" : 0.21203783067445
  }, {
    "company" : "India Universal Trust AL2 (PTC backed by loan receivables originated by HDFC Bank Limited) £^",
    "ticker" : "",
    "weight_pct" : 0.204918689224547
  }, {
    "company" : "Bharat Forge Ltd",
    "ticker" : "BHARATFORG",
    "weight_pct" : 0.204640987306122
  }, {
    "company" : "7.81% State Bank of India (Tier 2 - Basel III)^",
    "ticker" : "",
    "weight_pct" : 0.202914328388318
  }, {
    "company" : "9.1% Cholamandalam Investment & Finance Co. Ltd.^",
    "ticker" : "",
    "weight_pct" : 0.202631778805481
  }, {
    "company" : "Indian Railways Finance Corp. Ltd.^",
    "ticker" : "",
    "weight_pct" : 0.201851403767171
  }, {
    "company" : "7.65% LIC Housing Finance Ltd.^",
    "ticker" : "",
    "weight_pct" : 0.201666203200269
  }, {
    "company" : "7.59% National Housing Bank",
    "ticker" : "",
    "weight_pct" : 0.201407990871416
  }, {
    "company" : "7.4% National Bank for Agri & Rural Dev.",
    "ticker" : "",
    "weight_pct" : 0.200822116001123
  }, {
    "company" : "National Bank for Agri & Rural Dev.",
    "ticker" : "",
    "weight_pct" : 0.199510674379946
  }, {
    "company" : "08.00% Toyota Financial Services India Ltd.^",
    "ticker" : "",
    "weight_pct" : 0.198592783963434
  }, {
    "company" : "7.80% Mahanagar Telephone Nigam  Ltd. (Corporate guarantee from Govt of India)",
    "ticker" : "",
    "weight_pct" : 0.196917866443327
  }, {
    "company" : "7.22% Madhya Pradesh SDL ISD 060825 Mat 060843^",
    "ticker" : "",
    "weight_pct" : 0.193494426049602
  }, {
    "company" : "CESC Ltd",
    "ticker" : "CESC",
    "weight_pct" : 0.192433282203137
  }, {
    "company" : "LMW Ltd",
    "ticker" : "LMW",
    "weight_pct" : 0.191575740261951
  }, {
    "company" : "7.3% GOI MAT 190653",
    "ticker" : "",
    "weight_pct" : 0.187484608294499
  }, {
    "company" : "Savita Oil Technologies Ltd",
    "ticker" : "SOTL",
    "weight_pct" : 0.181481122182708
  }, {
    "company" : "Life Insurance Corporation Of India",
    "ticker" : "LICI",
    "weight_pct" : 0.177671154751118
  }, {
    "company" : "7.39% Indian Railways Finance Corp. Ltd.",
    "ticker" : "",
    "weight_pct" : 0.175845366042698
  }, {
    "company" : "National Housing Bank^",
    "ticker" : "",
    "weight_pct" : 0.175795900079316
  }, {
    "company" : "Glenmark Pharmaceuticals Ltd",
    "ticker" : "GLENMARK",
    "weight_pct" : 0.168455348977316
  }, {
    "company" : "7.35% REC Limited.^",
    "ticker" : "",
    "weight_pct" : 0.166572179751373
  }, {
    "company" : "National Bank for Agri & Rural Dev.",
    "ticker" : "",
    "weight_pct" : 0.163093535342514
  }, {
    "company" : "7.22% Madhya Pradesh ISD 060825 MAT 060848^",
    "ticker" : "",
    "weight_pct" : 0.161841848605102
  }, {
    "company" : "Ambuja Cements Ltd",
    "ticker" : "AMBUJACEM",
    "weight_pct" : 0.157407818579487
  }, {
    "company" : "7.835% LIC Housing Finance Ltd.",
    "ticker" : "",
    "weight_pct" : 0.155487648812934
  }, {
    "company" : "Jio Financial Services Ltd",
    "ticker" : "JIOFIN",
    "weight_pct" : 0.15359745542019
  }, {
    "company" : "7.66% LIC Housing Finance Ltd.^",
    "ticker" : "",
    "weight_pct" : 0.151001085934209
  }, {
    "company" : "7.79% Small Industries Development Bank",
    "ticker" : "",
    "weight_pct" : 0.150825086036496
  }, {
    "company" : "7.62% National Bank for Agri & Rural Dev.",
    "ticker" : "",
    "weight_pct" : 0.150804013536096
  }, {
    "company" : "Power Finance Corporation Ltd.^",
    "ticker" : "",
    "weight_pct" : 0.149565781540723
  }, {
    "company" : "7.12% Power Grid Corporation of India Ltd.^",
    "ticker" : "",
    "weight_pct" : 0.149504542678057
  }, {
    "company" : "SBI Cards and Payment Services Ltd",
    "ticker" : "SBICARD",
    "weight_pct" : 0.149283627685594
  }, {
    "company" : "Garden Reach Shipbuilders & Engineers Ltd",
    "ticker" : "GRSE",
    "weight_pct" : 0.147991576722062
  }, {
    "company" : "Indian Railways Finance Corp. Ltd.^",
    "ticker" : "",
    "weight_pct" : 0.144228700887612
  }, {
    "company" : "Adani Ports and Special Economic Zone Ltd",
    "ticker" : "ADANIPORTS",
    "weight_pct" : 0.140479873386762
  }, {
    "company" : "Avenue Supermarts Ltd",
    "ticker" : "DMART",
    "weight_pct" : 0.135340854451031
  }, {
    "company" : "Ashok Leyland Ltd",
    "ticker" : "ASHOKLEY",
    "weight_pct" : 0.133526245050334
  }, {
    "company" : "Indraprastha Gas Ltd",
    "ticker" : "IGL",
    "weight_pct" : 0.13300457700051
  }, {
    "company" : "7.8% TATA Capital Housing Finance Ltd.^",
    "ticker" : "",
    "weight_pct" : 0.130384463852105
  }, {
    "company" : "Bharti Airtel Ltd. - PARTLY PAID UP SHARES",
    "ticker" : "",
    "weight_pct" : 0.129309964195527
  }, {
    "company" : "Small Industries Development Bank^",
    "ticker" : "",
    "weight_pct" : 0.125075380934268
  }, {
    "company" : "7.37% Housing and Urban Development Corporation Ltd.^",
    "ticker" : "",
    "weight_pct" : 0.124749004507875
  }, {
    "company" : "Dr Reddy's Laboratories Ltd",
    "ticker" : "DRREDDY",
    "weight_pct" : 0.124664120914712
  }, {
    "company" : "7.23% GOI MAT 150439",
    "ticker" : "",
    "weight_pct" : 0.124388298702895
  }, {
    "company" : "7.5% Bajaj Housing Finance Ltd.^",
    "ticker" : "",
    "weight_pct" : 0.123833488457605
  }, {
    "company" : "Apollo Hospitals Enterprise Ltd",
    "ticker" : "APOLLOHOSP",
    "weight_pct" : 0.119988993783575
  }, {
    "company" : "7.43% Jamnagar Utilities & Power Pvt. Ltd. (erstwhile Reliance Utilities & Power Pvt. Ltd.)^",
    "ticker" : "",
    "weight_pct" : 0.118755708384541
  }, {
    "company" : "7.96% Pipeline Infrastructure Pvt. Ltd.^",
    "ticker" : "",
    "weight_pct" : 0.116620064881497
  }, {
    "company" : "7.1 GOI 2029",
    "ticker" : "",
    "weight_pct" : 0.111728375762674
  }, {
    "company" : "7.96 REC Limited.",
    "ticker" : "",
    "weight_pct" : 0.111564148764247
  }, {
    "company" : "Gujarat Industries Power Company Ltd",
    "ticker" : "GIPCL",
    "weight_pct" : 0.111323843114138
  }, {
    "company" : "Power Finance Corporation Ltd.^",
    "ticker" : "",
    "weight_pct" : 0.110073343559847
  }, {
    "company" : "8.75% LIC Housing Finance Ltd.^",
    "ticker" : "",
    "weight_pct" : 0.103796211738629
  }, {
    "company" : "7.64% National Bank for Agri & Rural Dev.",
    "ticker" : "",
    "weight_pct" : 0.101310744942549
  }, {
    "company" : "7.51% National Housing Bank",
    "ticker" : "",
    "weight_pct" : 0.101154333566336
  }, {
    "company" : "7.87% LIC Housing Finance Ltd.^",
    "ticker" : "",
    "weight_pct" : 0.101089533154306
  }, {
    "company" : "7.44% Power Finance Corporation Ltd.^",
    "ticker" : "",
    "weight_pct" : 0.100629895422562
  }, {
    "company" : "LIC Housing Finance Ltd.^",
    "ticker" : "",
    "weight_pct" : 0.100580627323034
  }, {
    "company" : "7.59% National Housing Bank^",
    "ticker" : "",
    "weight_pct" : 0.100560148414194
  }, {
    "company" : "7.79% Small Industries Development Bank",
    "ticker" : "",
    "weight_pct" : 0.100516024774858
  }, {
    "company" : "7.75% LIC Housing Finance Ltd.^",
    "ticker" : "",
    "weight_pct" : 0.100388996180893
  }, {
    "company" : "7.37% Indian Railways Finance Corp. Ltd.^",
    "ticker" : "",
    "weight_pct" : 0.100361690969106
  }, {
    "company" : "8.1929% Kotak Mahindra Investments Ltd.^",
    "ticker" : "",
    "weight_pct" : 0.100298770263685
  }, {
    "company" : "7.4% Power Finance Corporation Ltd.^",
    "ticker" : "",
    "weight_pct" : 0.100277104171724
  }, {
    "company" : "National Bank for Agri & Rural Dev.^",
    "ticker" : "",
    "weight_pct" : 0.0999980172063237
  }, {
    "company" : "Toyota Financial Services India Ltd.^",
    "ticker" : "",
    "weight_pct" : 0.0999032404204843
  }, {
    "company" : "Power Finance Corporation Ltd.",
    "ticker" : "",
    "weight_pct" : 0.0998893899507374
  }, {
    "company" : "Housing and Urban Development Corporation Ltd.^",
    "ticker" : "",
    "weight_pct" : 0.0997363422600342
  }, {
    "company" : "7.7% Bajaj Finance Ltd.^",
    "ticker" : "",
    "weight_pct" : 0.0997325828468172
  }, {
    "company" : "National Bank for Agri & Rural Dev.^",
    "ticker" : "",
    "weight_pct" : 0.0997124996656842
  }, {
    "company" : "REC Limited.^",
    "ticker" : "",
    "weight_pct" : 0.0996953844423541
  }, {
    "company" : "National Bank for Agri & Rural Dev.",
    "ticker" : "",
    "weight_pct" : 0.0996942961911597
  }, {
    "company" : "Small Industries Development Bank",
    "ticker" : "",
    "weight_pct" : 0.0996780713551705
  }, {
    "company" : "REC Limited.^",
    "ticker" : "",
    "weight_pct" : 0.0994238163033883
  }, {
    "company" : "7.75% Small Industries Development Bank",
    "ticker" : "",
    "weight_pct" : 0.0991552161222253
  }, {
    "company" : "Texmaco Rail & Engineering Ltd",
    "ticker" : "TEXRAIL",
    "weight_pct" : 0.0989760504028566
  }, {
    "company" : "Aditya Birla Sun Life AMC Ltd",
    "ticker" : "ABSLAMC",
    "weight_pct" : 0.0989421167519767
  }, {
    "company" : "Kotak Mahindra Investments Ltd.^",
    "ticker" : "",
    "weight_pct" : 0.0989042258240263
  }, {
    "company" : "6.4% LIC Housing Finance Ltd.",
    "ticker" : "",
    "weight_pct" : 0.0984577460385425
  }, {
    "company" : "6.64% Housing and Urban Development Corporation Ltd.",
    "ticker" : "",
    "weight_pct" : 0.0983074684417887
  }, {
    "company" : "ITC Hotels Ltd",
    "ticker" : "ITCHOTELS",
    "weight_pct" : 0.0978330898529576
  }, {
    "company" : "JSW Energy Ltd",
    "ticker" : "JSWENERGY",
    "weight_pct" : 0.0956091990712405
  }, {
    "company" : "Zee Entertainment Enterprises Ltd",
    "ticker" : "ZEEL",
    "weight_pct" : 0.0936776521331095
  }, {
    "company" : "Sansar Trust July 2023 II (PTC backed by loan receivables originated by Shriram Finance Limited)^",
    "ticker" : "",
    "weight_pct" : 0.0887264059943756
  }, {
    "company" : "7.53% REC Limited.^",
    "ticker" : "",
    "weight_pct" : 0.0809629209054619
  }, {
    "company" : "Shriram Finance Ltd",
    "ticker" : "SHRIRAMFIN",
    "weight_pct" : 0.0789322441767139
  }, {
    "company" : "Hindalco Industries Ltd",
    "ticker" : "HINDALCO",
    "weight_pct" : 0.0778053105989506
  }, {
    "company" : "7.46% Indian Railways Finance Corp. Ltd.^",
    "ticker" : "",
    "weight_pct" : 0.0754848622567123
  }, {
    "company" : "Indian Railways Finance Corp. Ltd.^",
    "ticker" : "",
    "weight_pct" : 0.0752189332375719
  }, {
    "company" : "Home First Finance Company India Ltd",
    "ticker" : "HOMEFIRST",
    "weight_pct" : 0.074572116300392
  }, {
    "company" : "7.55% L&T Metro Rail (Hyderabad) Ltd^",
    "ticker" : "",
    "weight_pct" : 0.0740121615949105
  }, {
    "company" : "Five-Star Business Finance Ltd",
    "ticker" : "FIVESTAR",
    "weight_pct" : 0.0727958924872798
  }, {
    "company" : "Aegis Vopak Terminals Ltd",
    "ticker" : "AEGISVOPAK",
    "weight_pct" : 0.0719031307801658
  }, {
    "company" : "Housing and Urban Development Corporation Ltd",
    "ticker" : "HUDCO",
    "weight_pct" : 0.0667609460227783
  }, {
    "company" : "Info Edge (India) Ltd",
    "ticker" : "NAUKRI",
    "weight_pct" : 0.0606256825845386
  }, {
    "company" : "Bharti Hexacom Ltd",
    "ticker" : "BHARTIHEXA",
    "weight_pct" : 0.0605672138158214
  }, {
    "company" : "7.89% Tata Capital Financial Services Ltd.^",
    "ticker" : "",
    "weight_pct" : 0.0594799519406903
  }, {
    "company" : "Torrent Power Ltd",
    "ticker" : "TORNTPOWER",
    "weight_pct" : 0.0588436217877473
  }, {
    "company" : "6.83% HDFC Bank Ltd.£^",
    "ticker" : "",
    "weight_pct" : 0.0584169283876163
  }, {
    "company" : "Canara Bank (Tier 2 - Basel III)^",
    "ticker" : "",
    "weight_pct" : 0.054715885007393
  }, {
    "company" : "Bandhan Bank Ltd",
    "ticker" : "BANDHANBNK",
    "weight_pct" : 0.0541585025320073
  }, {
    "company" : "7.8% HDFC Bank Ltd.£^",
    "ticker" : "",
    "weight_pct" : 0.0509658703234218
  }, {
    "company" : "7.64% Gujarat SDL ISD 170124 Mat 170133^",
    "ticker" : "",
    "weight_pct" : 0.0507609823030945
  }, {
    "company" : "Grasim Industries Ltd.^",
    "ticker" : "",
    "weight_pct" : 0.0504668576848266
  }, {
    "company" : "7.25% Indian Oil Corporation Ltd.^",
    "ticker" : "",
    "weight_pct" : 0.0503449735510539
  }, {
    "company" : "Indian Railways Finance Corp. Ltd.^",
    "ticker" : "",
    "weight_pct" : 0.0503383451119607
  }, {
    "company" : "Union Bank of India**",
    "ticker" : "",
    "weight_pct" : 0.0503200427055095
  }, {
    "company" : "7.48% Small Industries Development Bank",
    "ticker" : "",
    "weight_pct" : 0.0503008499117174
  }, {
    "company" : "7.7% HDFC Bank Ltd.£^",
    "ticker" : "",
    "weight_pct" : 0.050296397975013
  }, {
    "company" : "7.9% LIC Housing Finance Ltd.^",
    "ticker" : "",
    "weight_pct" : 0.0502648386903755
  }, {
    "company" : "Grasim Industries Ltd.^",
    "ticker" : "",
    "weight_pct" : 0.0501677864702204
  }, {
    "company" : "7.83% National Bank for Agri & Rural Dev.",
    "ticker" : "",
    "weight_pct" : 0.0501456257186254
  }, {
    "company" : "Power Grid Corporation of India Ltd.^",
    "ticker" : "",
    "weight_pct" : 0.0500868601541279
  }, {
    "company" : "Power Finance Corporation Ltd.^",
    "ticker" : "",
    "weight_pct" : 0.0500061317018889
  }, {
    "company" : "Sundaram Home Finance Limited^",
    "ticker" : "",
    "weight_pct" : 0.049948355456659
  }, {
    "company" : "Indian Railways Finance Corp. Ltd.^",
    "ticker" : "",
    "weight_pct" : 0.049924512862309
  }, {
    "company" : "7.55% Small Industries Development Bank^",
    "ticker" : "",
    "weight_pct" : 0.0499050232727365
  }, {
    "company" : "6.79% GOI MAT 071034",
    "ticker" : "",
    "weight_pct" : 0.0498434876142896
  }, {
    "company" : "Bajaj Housing Finance Ltd.^",
    "ticker" : "",
    "weight_pct" : 0.0498010458177081
  }, {
    "company" : "LIC Housing Finance Ltd.^",
    "ticker" : "",
    "weight_pct" : 0.0496256395115564
  }, {
    "company" : "ICICI Securities Ltd^",
    "ticker" : "",
    "weight_pct" : 0.0494493428180638
  }, {
    "company" : "6.90% Housing and Urban Development Corporation Ltd.",
    "ticker" : "",
    "weight_pct" : 0.0493090573459131
  }, {
    "company" : "Alkem Laboratories Ltd",
    "ticker" : "ALKEM",
    "weight_pct" : 0.0463486183694415
  }, {
    "company" : "JSW Steel Ltd",
    "ticker" : "JSWSTEEL",
    "weight_pct" : 0.0463434739092498
  }, {
    "company" : "Colgate-Palmolive (India) Ltd",
    "ticker" : "COLPAL",
    "weight_pct" : 0.0461378933654352
  }, {
    "company" : "RHI Magnesita India Ltd",
    "ticker" : "RHIM",
    "weight_pct" : 0.0454813810994325
  }, {
    "company" : "Fortis Healthcare Ltd",
    "ticker" : "FORTIS",
    "weight_pct" : 0.0450882256224743
  }, {
    "company" : "7.63% Gujarat SDL ISD 240124 Mat 240133^",
    "ticker" : "",
    "weight_pct" : 0.043805672123912
  }, {
    "company" : "7.64% % Gujarat SDL ISD 170124 Mat 170134^",
    "ticker" : "",
    "weight_pct" : 0.0389164563032588
  }, {
    "company" : "7.7% National Bank for Agri & Rural Dev.^",
    "ticker" : "",
    "weight_pct" : 0.0377486638397422
  }, {
    "company" : "7.58% LIC Housing Finance Ltd.",
    "ticker" : "",
    "weight_pct" : 0.0377094867967439
  }, {
    "company" : "8.7% REC Limited.^",
    "ticker" : "",
    "weight_pct" : 0.0365645476083097
  }, {
    "company" : "Titan Company Ltd",
    "ticker" : "TITAN",
    "weight_pct" : 0.0354965774588975
  }, {
    "company" : "7.48% Uttar Pradesh SDL ISD 200324 Mat 200336^",
    "ticker" : "",
    "weight_pct" : 0.0352068058454071
  }, {
    "company" : "7.4% HDFC Bank Ltd.£^",
    "ticker" : "",
    "weight_pct" : 0.0348944777526147
  }, {
    "company" : "7.25% GOI MAT 120663",
    "ticker" : "",
    "weight_pct" : 0.0308696301760944
  }, {
    "company" : "7.63% Gujarat SDL ISD 240124 Mat 240134^",
    "ticker" : "",
    "weight_pct" : 0.0303519194033409
  }, {
    "company" : "7.1% HDFC Bank Ltd.£^",
    "ticker" : "",
    "weight_pct" : 0.029516439281823
  }, {
    "company" : "Vodafone Idea Ltd",
    "ticker" : "IDEA",
    "weight_pct" : 0.0285901396515361
  }, {
    "company" : "Indian Hotels Company Ltd",
    "ticker" : "INDHOTEL",
    "weight_pct" : 0.0256619524831895
  }, {
    "company" : "7.75% Indian Railways Finance Corp. Ltd.^",
    "ticker" : "",
    "weight_pct" : 0.0256156523414641
  }, {
    "company" : "Ramco Systems Ltd",
    "ticker" : "RAMCOSYS",
    "weight_pct" : 0.0236970654857392
  }, {
    "company" : "BEML Land Assets Ltd",
    "ticker" : "BLAL",
    "weight_pct" : 0.0228841418435234
  }, {
    "company" : "Adani Enterprises Ltd",
    "ticker" : "ADANIENT",
    "weight_pct" : 0.0217853049329609
  }, {
    "company" : "Bajaj Housing Finance Ltd",
    "ticker" : "BAJAJHFL",
    "weight_pct" : 0.0214615007366639
  }, {
    "company" : "7.45% Maharashtra ISD 220324 Mat 220339",
    "ticker" : "",
    "weight_pct" : 0.0200736836680253
  }, {
    "company" : "Great Eastern Shipping Company Ltd",
    "ticker" : "GESHIP",
    "weight_pct" : 0.0183489044568301
  }, {
    "company" : "GOI STRIPS - Mat 170628^",
    "ticker" : "",
    "weight_pct" : 0.0158283168267491
  }, {
    "company" : "RITES Ltd",
    "ticker" : "RITES",
    "weight_pct" : 0.0144806661203764
  }, {
    "company" : "L&T Finance Ltd",
    "ticker" : "LTF",
    "weight_pct" : 0.0131405342404378
  }, {
    "company" : "Campus Activewear Ltd",
    "ticker" : "CAMPUS",
    "weight_pct" : 0.012000442716415
  }, {
    "company" : "Emcure Pharmaceuticals Ltd",
    "ticker" : "EMCURE",
    "weight_pct" : 0.0111823746140074
  }, {
    "company" : "Star Health and Allied Insurance Company Ltd",
    "ticker" : "STARHEALTH",
    "weight_pct" : 0.0099677873491317
  }, {
    "company" : "7.63% Maharashtra SDL Mat 310135",
    "ticker" : "",
    "weight_pct" : 0.00967722428022724
  }, {
    "company" : "Union Bank of India Ltd",
    "ticker" : "UNIONBANK",
    "weight_pct" : 0.0086996779118769
  }, {
    "company" : "UPL Ltd.",
    "ticker" : "",
    "weight_pct" : 0.00851606025580381
  }, {
    "company" : "Aditya Infotech Ltd",
    "ticker" : "CPPLUS",
    "weight_pct" : 0.00752317943880512
  }, {
    "company" : "Cummins India Ltd",
    "ticker" : "CUMMINSIND",
    "weight_pct" : 0.00726783613582847
  }, {
    "company" : "Exide Industries Ltd",
    "ticker" : "EXIDEIND",
    "weight_pct" : 0.00557451727734406
  }, {
    "company" : "6.99% GOI MAT 151251",
    "ticker" : "",
    "weight_pct" : 0.00478583195718528
  }, {
    "company" : "7.17% GOI MAT 170430",
    "ticker" : "",
    "weight_pct" : 0.00467087305828607
  }, {
    "company" : "6.67% GOI MAT 171250",
    "ticker" : "",
    "weight_pct" : 0.00463169601528772
  }, {
    "company" : "Torrent Pharmaceuticals Ltd",
    "ticker" : "TORNTPHARM",
    "weight_pct" : 0.00440227287712312
  }, {
    "company" : "Varun Beverages Ltd",
    "ticker" : "VBL",
    "weight_pct" : 0.00429522853236499
  }, {
    "company" : "Petronet LNG Ltd",
    "ticker" : "PETRONET",
    "weight_pct" : 0.00287951266037901
  }, {
    "company" : "Indian Railway Catering and Tourism Corporation Ltd",
    "ticker" : "IRCTC",
    "weight_pct" : 0.00287515965560142
  }, {
    "company" : "AGS Transact Technologies Ltd",
    "ticker" : "AGSTRA",
    "weight_pct" : 0.00264583544936358
  }, {
    "company" : "Dabur India Ltd",
    "ticker" : "DABUR",
    "weight_pct" : 0.00264207603614657
  }, {
    "company" : "Persistent Systems Ltd",
    "ticker" : "PERSISTENT",
    "weight_pct" : 0.00241443367266371
  }, {
    "company" : "Laurus Labs Ltd",
    "ticker" : "LAURUSLABS",
    "weight_pct" : 0.00216176153170968
  }, {
    "company" : "National Aluminium Co Ltd",
    "ticker" : "NATIONALUM",
    "weight_pct" : 0.00193402023630005
  }, {
    "company" : "7.47% Chhattisgarh SDL ISD 200324 MAT 200334^",
    "ticker" : "",
    "weight_pct" : 0.00165067919804933
  }, {
    "company" : "8.07% Kerala SDL Mat 150626^",
    "ticker" : "",
    "weight_pct" : 0.00150792042772957
  }, {
    "company" : "LIC Housing Finance Ltd",
    "ticker" : "LICHSGFIN",
    "weight_pct" : 0.0013182679241239
  }, {
    "company" : "Grasim Industries Ltd",
    "ticker" : "GRASIM",
    "weight_pct" : 0.00123565976527637
  }, {
    "company" : "Indian Energy Exchange Ltd",
    "ticker" : "IEX",
    "weight_pct" : 0.00108914158173959
  }, {
    "company" : "Crompton Greaves Consumer Electricals Ltd",
    "ticker" : "CROMPTON",
    "weight_pct" : 0.000705186773970371
  }, {
    "company" : "Asian Paints Ltd",
    "ticker" : "ASIANPAINT",
    "weight_pct" : 0.000498320115107851
  }, {
    "company" : "Tata Consumer Products Ltd",
    "ticker" : "TATACONSUM",
    "weight_pct" : 0.000480215572510126
  }, {
    "company" : "UPL Ltd",
    "ticker" : "UPL",
    "weight_pct" : 0.000248912727737016
  }, {
    "company" : "Canara Bank Ltd",
    "ticker" : "CANBK",
    "weight_pct" : 0.000208053841983683
  }, {
    "company" : "Indus Towers Ltd",
    "ticker" : "INDUSTOWER",
    "weight_pct" : 0.000178967855515208
  }, {
    "company" : "Tech Mahindra Ltd",
    "ticker" : "TECHM",
    "weight_pct" : 8.79504828927693E-5
  }, {
    "company" : "MEP Infrastructure Developers Ltd",
    "ticker" : "MEP",
    "weight_pct" : 8.01348606784513E-6
  }, {
    "company" : "Indian Railway Finance Corp Ltd",
    "ticker" : "IRFC",
    "weight_pct" : 0
  }, {
    "company" : "Bharat Petroleum Corporation Ltd.",
    "ticker" : "",
    "weight_pct" : 0
  }, {
    "company" : "Piramal Enterprises Ltd",
    "ticker" : "PEL",
    "weight_pct" : 0
  }, {
    "company" : "Aarti Industries Ltd",
    "ticker" : "AARTIIND",
    "weight_pct" : 0
  } ]
}
]

export const funds: FundPortfolio[] = rawData.map(fund => ({
  schemeCode: fund.fund_name.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 15) + fund.constituents_count,
  schemeName: fund.fund_name,
  holdings: (fund.constituents || [])
    .filter(c => c.company && c.weight_pct !== null && c.weight_pct > 0)
    .map(c => ({
      name: c.company,
      weight: c.weight_pct || 0,
      sector: 'Unknown', 
    })),
}));

