import React from "react";
import "./PageOverlay.css";

export default function PageOverlay({ activePage, onClose }) {
  if (!activePage) return null;

  const titleMap = {
    home: "Početna",
    "o meni": "O meni",
    works: "Radovi",
    radovi: "Radovi",
    contact: "Kontakt"
  };
  const title = titleMap[activePage] || activePage;

  return (
    <div className="overlay">
      <div className="overlay-inner">
        <button className="back-btn" onClick={onClose}>↩ Nazad</button>
        <h1>{title}</h1>
        <div className="overlay-content">
          {activePage === "početna" || activePage === "home" ? (
            <div className="page-home">
              <p>
                Dobrodošao u moj mračni portfolio. 🦇<br />
                Ovde počinje tvoje putovanje kroz svet izrade sajtova u horor-gotičkom stilu. 
                Svaka kartica lebdi u mističnom ambijentu, sa svetlećim pergament efektom i tamnim nebom u pozadini.
              </p>
              <p>
                Portfolio je fokusiran na izradu web sajtova koristeći <strong>HTML</strong>, <strong>CSS</strong>, <strong>JavaScript</strong> i <strong>React</strong>.
              </p>
            </div>
          ) : activePage === "o meni" ? (
            <div className="page-about">
              <p>
                Ja sam mračni web developer sa strašću za kodom i dizajnom. 🌑
              </p>
              <ul>
                <li>Veštine: HTML, CSS, JavaScript, React</li>
                <li>Sertifikat: Comtrade (biće prikazan ovde)</li>
                <li>Strast za kreiranje modernih i elegantnih sajtova</li>
                <li>Strog, ali motivišući pristup radu</li>
              </ul>
              <p>
                Sve stranice koje kreiram imaju mračnu, gotičku estetiku i pažnju na detalje.
              </p>
            </div>
          ) : activePage === "radovi" || activePage === "works" ? (
            <div className="page-works">
              <p>Pregled mojih projekata i postignuća. 💀</p>
              <div className="works-grid">
                <div className="work-card">Projekt 1</div>
                <div className="work-card">Projekt 2</div>
                <div className="work-card">Projekt 3</div>
                <div className="work-card">Projekt 4</div>
              </div>
            </div>
          ) : activePage === "kontakt" ? (
            <div className="page-contact">
              <p>Kontaktiraj me ako želiš svoj horor-gotički sajt. 🕯️</p>
              <ul>
                <li>Email: tvoj@email.com</li>
                <li>Telefon: +381 60 1234567</li>
                <li>Instagram / LinkedIn / TikTok</li>
              </ul>
            </div>
          ) : (
            <p>Sadržaj stranice {activePage}</p>
          )}
        </div>
      </div>
    </div>
  );
}
