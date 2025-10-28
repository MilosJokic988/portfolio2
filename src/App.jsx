import React, { useState } from "react";
import ThreeMenu from "./components/ThreeMenu";
import PageOverlay from "./components/PageOverlay";

export default function App() {
  const [activePage, setActivePage] = useState(null); // null | 'home' | 'about' | 'works' | 'contact'
  const [openFrom, setOpenFrom] = useState(null); // store which card opened (for return anim)

  return (
    <div className="app-root">
      <ThreeMenu
        onOpenPage={(page, originPos) => {
          setActivePage(page);
          setOpenFrom({ page, originPos });
        }}
        onClosePage={() => {
          setActivePage(null);
          setOpenFrom(null);
        }}
        activePage={activePage}
      />
      <PageOverlay
        activePage={activePage}
        onClose={() => setActivePage(null)}
      />
      <div className="dev-hint">Klikni na ploču: Početna / O meni / Radovi / Kontakt</div>
    </div>
  );
}
