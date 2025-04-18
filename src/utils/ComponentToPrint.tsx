import React, { CSSProperties, forwardRef } from "react";
//import './fonts.css';

const styles: { [key: string]: CSSProperties } = {
  ".print-details h1": { fontSize: "16px", margin: "0", padding: "1px" },
  img: {
    padding: "3px",
    height: "150px",
    borderTop: "1px solid grey",
    borderBottom: "1px solid grey",
    borderLeft: "1px solid grey",
    borderRight: "1px solid grey",
    marginTop: "17px",
    objectFit: "cover",
    aspectRatio: "1/1",
  },
  ".name": {
    color: "white",
    margin: 8,
    padding: "10px 10px 0",
    fontSize: 25,
    fontWeight: 400,
    width: "70%",
    border: "1px solid grey",
    textAlign: "center",
    fontFamily: '"Helvetica Neue',
  },
  ".code": {
    color: "white",
    margin: 0,
    padding: "10px 10px 0",
    fontSize: 25,
    fontWeight: 400,
    marginBottom: 25,
    width: "70%",
    border: "1px solid grey",
    textAlign: "center",
    fontFamily: '"Helvetica Neue',
  },
  ".line": {
    width: "100%",
    borderTop: "1px solid white",
    margin: "0",
    padding: "0",
    fontFamily: '"Helvetica Neue',
  },
  ".details": {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignSelf: "flex-start",
    padding: "0",
    height: 160,
    fontFamily: '"Helvetica Neue',
  },
  ".details p": {
    fontWeight: "bold",
    fontSize: "14px",
    padding: "0",
    textDecoration: "underline",
    margin: "0",
    fontFamily: '"Helvetica Neue',
  },
  ".details ul": {
    listStyle: "none",
    padding: "0",
    margin: "0",
    fontSize: "14px",
    marginBottom: "12px",
    fontFamily: '"Helvetica Neue',
  },
  ".third-para": {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignSelf: "flex-start",
    marginBottom: "5px",
  },
  ".third-para ul": {
    listStyle: "none",
    padding: "0",
    margin: "0",
    fontSize: "14px",
    marginBottom: "12px",
  },
  ".third-para h3": {
    textDecoration: "none",
    margin: "0",
    padding: "0",
    fontSize: 13,
    fontWeight: 800,
  },
  ".third-para ul li": { textDecoration: "underline" },
  ".four-para": {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignSelf: "flex-start",
    marginBottom: "5px",
  },
  ".four-para h3.refund": {
    textDecoration: "underline",
    margin: "5px 0 13px",
    padding: "0",
    fontFamily: '"DIN Condensed", sans-serif"',
  },
  ".four-para h3.list": {
    textDecoration: "underline",
    margin: "0 0 9px",
    padding: "0",
    fontFamily: '"DIN Condensed", sans-serif',
  },
  ".four-para p.first": {
    padding: "0",
    margin: "0 0 13px",
    fontFamily: '"DIN Condensed", sans-serif"',
  },
  ".four-para p.second": {
    padding: "0",
    margin: "0 0 6px",
    fontFamily: '"DIN Condensed", sans-serif"',
  },
  ".five-para": {
    display: "inline-block",
    padding: "0 10px",
    fontSize: "14px",
    marginBottom: "1px",
    fontFamily: '"Helvetica Neue"',
    textAlign: "justify",
    letterSpacing: 0,
    transform: "scale(1, 1.2)",
  },
  ".five-para .emphasize": {
    textDecoration: "underline",
    fontWeight: "600",
    fontFamily: '"Impact"',
  },
  ".last-para": {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "16px 0 0 0",
  },
  ".last-para a": {
    fontSize: "13px",
    fontWeight: "bold",
    padding: "2px",
    margin: "0",
    marginBottom: "8px",
    fontFamily: '"DIN Condensed", sans-serif',
    color: "white",
    textDecoration: "none",
  },
  ".last-para h5": {
    fontSize: "14px",
    padding: "1px",
    margin: "0",
    marginBottom: "18px",
  },
  ".last-para p": { fontSize: "9.5px", padding: "2px", margin: "0" },
  ".print-btn": {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  ".print-btn button": {
    margin: "10px",
    padding: "5px 8px",
    backgroundColor: "inherit",
    color: "blue",
    borderRadius: "3px",
    fontSize: "18px",
  },
};

const ComponentToPrint = forwardRef<
  HTMLDivElement,
  {
    level: number;
    name: string;
    code: string;
    background?: string;
    image?: string;
  }
>((props, ref) => {
  const titles = [
    "GRADE ONE",
    "GRADE TWO",
    "GRADE THREE",
    "GRADE FOUR",
    "GRADE FIVE",
  ];

  const vices = [
    "(01)-Lottery drawn participant(s) unique passcode to enter intergalactic epicentre E.T handshake.",
    "(02)-Passcode to access secure channel-LIVE feed on moment of Extraterrestrial Global contact.",
    "(03)-Sponsor(s) registered name to be forged into Giant Iron Tablet for historical commemoration.",
    "(04)-10 days daily countdown alert prior tailored welcome uniform and space taxi pickup point(s).",
    "(05)-Permit access to the front of spacers seated position rim for an absolute unobstructive view.",
    "(06)-Pre-booking residential deposited into contact platform-spaceport for all future E.T contacts.",
    "(07)-Ten available return trips from Earth to Off-World visitations with or without Contact success.",
  ];

  const displayedVices: string[] = [];
  for (let i = 0; i < props.level; i++) {
    displayedVices.push(vices[i + 3]);
  }

  return (
    <div
      style={{
        width: "97.4%",
        height: "97%",
        background: "black",
        padding: "11px",
        margin: "0",
      }}
    >
      <style>
        {
          "@font-face {font-family: 'DIN Condensed'; src: url('https://yaavaay.com/static/media/DIN-Condensed-Bold.b4245a6a96ce6bf9c4bf.ttf') format('truetype');}"
        }
      </style>
      <div
        ref={ref}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "91.5%",
          background:
            "rgba(0, 0, 0, .8) url('https://yaavaay.com/assets/images/pdfbackground.png')",
          backgroundBlendMode: "multiply",
          backgroundSize: "cover",
          backgroundPosition: "50%",
          backgroundRepeat: "no-repeat",
          padding: "40px",
          border: "5px solid",
          borderImage:
            "linear-gradient( 50deg, #02a2ff, white, #02a2ff, white, #02a2ff) 1",
          color: "white",
          fontFamily: "Helvetica",
        }}
      >
        <div
          style={{
            width: "97.4%",
            height: "97%",
            background: "black",
            padding: "11px",
            margin: "0",
          }}
        >
          <style>
            {
              "@font-face {font-family: 'DIN Condensed'; src: url('https://yaavaay.com/static/media/DIN-Condensed-Bold.b4245a6a96ce6bf9c4bf.ttf') format('truetype');}"
            }
          </style>
          <div
            ref={ref}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: "91.5%",

              background:
                "rgba(0, 0, 0, .8) url('https://yaavaay.com/assets/images/pdfbackground.png')", //background image goes here
              backgroundBlendMode: "multiply",
              backgroundSize: "cover",
              backgroundPosition: "50%",
              backgroundRepeat: "no-repeat",
              padding: "40px",
              border: "5px solid",
              borderImage:
                "linear-gradient( 50deg, #02a2ff, white, #02a2ff, white, #02a2ff) 1",

              color: "white",
              fontFamily: "Helvetica",
            }}
          >
            <h1
              style={{
                fontSize: 21,
                marginBottom: -4,
                fontFamily: '"DIN Condensed", sans-serif"',
                marginTop: -20,
                fontWeight: "bold",
                letterSpacing: -1,
              }}
            >
              {titles[props.level]} ( Sponsor Certificate Receipt )
            </h1>
            <p
              style={{
                fontSize: 10,
                textDecoration: "underline",
                fontFamily: '"DIN Condensed", sans-serif',
                padding: 0,
              }}
            >
              This Document Grant The Certify Holder - Perk(s) Purchased
            </p>
            <img
              src={
                props.image
                  ? props.image
                  : "https://icon-library.com/images/default-profile-icon/default-profile-icon-5.jpg"
              }
              alt="user"
              style={styles["img"]}
            />
            <h2 style={styles[".name"]}>{props.name}</h2>
            <h2 style={styles[".code"]}>YAAVAAY: {props.code}</h2>
            <div style={styles[".line"]} />
            <div style={styles[".details"]}>
              <p style={styles[".details p"]}>
                This unique passcode permits secure access to the VICE(s) stated
                below.
              </p>
              <ul style={styles[".details ul"]}>
                <li>{vices[0]}</li>
                <li>{vices[1]}</li>
                <li>{vices[2]}</li>
                {displayedVices.map((vice, index) => {
                  return <li key={index}>{vice}</li>;
                })}
              </ul>
            </div>
            <div style={styles[".line"]} />
            <div style={styles[".third-para"]}>
              <h3 style={styles[".third-para h3"]}>
                Prior Entry into SpaceTaxi(s) PROTOCOL
              </h3>
              <ul style={styles[".third-para ul"]}>
                <li style={styles[".third-para ul li"]}>
                  (01)-Security facial Recognition MATCH
                </li>
                <li style={styles[".third-para ul li"]}>
                  (02)-Unique Passcode MATCH
                </li>
                <li style={styles[".third-para ul li"]}>
                  (03)-Clean Scan MATCH
                </li>
                <li style={styles[".third-para ul li"]}>(04)-Identity MATCH</li>
              </ul>
            </div>
            <div style={styles[".line"]} />
            <div style={styles[".four-para"]}>
              <h3 style={styles[".four-para h3.refund"]}>REFUND STATUS:</h3>
              <h3 style={styles[".four-para h3.list"]}>
                LOCAL SPACE TAXIS REJECTION
              </h3>
              <p style={styles[".four-para p.first"]}>
                Refund upon individuals whom failed the meat-free biological
                toxin scan by A.I security checks.
              </p>
              <h3 style={styles[".four-para h3.list"]}>
                UNTIMELY PRECURSOR DEMISE
              </h3>
              <p style={styles[".four-para p.first"]}>
                Refund in the event of sponsor(s) death or worsening of
                disability to crippling health conditions.
              </p>
              <h3 style={styles[".four-para h3.list"]}>
                CONTACT PLATFORM CONDITION
              </h3>
              <p style={styles[".four-para p.second"]}>
                Refund automatic through YAAVAAY failure to accomplish intended
                products & services agreed.
              </p>
            </div>
            <div style={styles[".line"]} />
            <div style={styles[".five-para"]}>
              <p>
                ALL SPONSORED PARTICIPANTS ARE STRONGLY ADVISED TO HAVE WITHIN
                THEIR POSSESSION{" "}
                <span style={styles[".five-para .emphasize"]}>
                  UNIQUE PASSCODE
                </span>{" "}
                OR{" "}
                <span style={styles[".five-para .emphasize"]}>
                  CERTIFICATE RECEIPT
                </span>{" "}
                OR BOTH PRIOR ENTRY INTO SPACETAXIS.
              </p>
            </div>
            <div style={styles[".line"]} />
            <div style={styles[".last-para"]}>
              <a href="https://www.yaavaay.com" style={styles[".last-para a"]}>
                YAAVAAY
              </a>
              <h5 style={styles[".last-para h5"]}>
                ( Earth Only Delibrate Mass Extraterrestrial Public Contact )
              </h5>
              <p style={styles[".last-para p"]}>
                YAAVAAY private contractor(s) research and development inclusive
                of all intended services are fully responcible for the
                succession of mass Extraterrestrial contact witnessed and
                experienced on a global scale. YAAVAAY multifaceted designs to
                manufactures specific technologies in their delibrated targetted
                output to engineer with high intensions the appointed invitation
                of benevolent Off-World entities to demonstrate open contact and
                integration publicly.
              </p>
            </div>
          </div>
        </div>

        <div style={styles[".last-para"]}>
          {/* Enhanced Share Links Section */}
          <div
            style={{
              display: "flex",
              gap: "20px",
              marginBottom: "15px",
              justifyContent: "center",
            }}
          >
            <a
              href="YAAVAAY.COM"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...styles[".last-para a"],
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <span style={{ fontSize: "18px" }}>🌐</span> Official Website
            </a>
            <a
              href="YAAVAAY.COM"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...styles[".last-para a"],
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <span style={{ fontSize: "18px" }}>🐦</span> Twitter
            </a>
            <a
              href="YAAVAAY.COM"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...styles[".last-para a"],
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <span style={{ fontSize: "18px" }}>📷</span> Instagram
            </a>
          </div>

          {/* Keep existing YAAVAAY link */}
          <a href="https://www.yaavaay.com" style={styles[".last-para a"]}>
            YAAVAAY
          </a>
          <h5 style={styles[".last-para h5"]}>
            ( Earth Only Deliberate Mass Extraterrestrial Public Contact )
          </h5>
          <p style={styles[".last-para p"]}>
            YAAVAAY private contractor(s) research and development inclusive of
            all intended services are fully responsible for the succession of
            mass Extraterrestrial contact witnessed and experienced on a global
            scale. YAAVAAY multifaceted designs to manufactures specific
            technologies in their deliberated targeted output to engineer with
            high intentions the appointed invitation of benevolent Off-World
            entities to demonstrate open contact and integration publicly.
          </p>
        </div>
      </div>
    </div>
  );
});

export default ComponentToPrint;
