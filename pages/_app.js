import React from "react";
import { Container, Menu } from "semantic-ui-react";
import Link from "next/link";

function MyApp({ Component, pageProps }) {
  return (
    <Container>
      <Menu style={{ marginTop: "15px" }}>
        <Link href="/">
          <a className="item">CrowdCoin</a>
        </Link>

        <Menu.Menu position="right">
          <Link href="/">
            <a className="item">Campaigns</a>
          </Link>
          <Link href="/campaigns/new">
            <a className="item">+</a>
          </Link>
        </Menu.Menu>
      </Menu>

      <Component {...pageProps} />
    </Container>
  );
}

export default MyApp;
