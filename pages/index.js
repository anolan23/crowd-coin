import { useRouter } from "next/router";
import { Card, Button } from "semantic-ui-react";
import Link from "next/link";

import factory from "../ethereum/factory";

function Home({ campaigns = [] }) {
  const router = useRouter();
  const { isFallback } = router;

  if (isFallback) {
    return <div>Loading...</div>;
  }

  function renderCampaigns() {
    const items = campaigns.map((address) => {
      return {
        header: address,
        description: (
          <Link href={`/campaigns/${address}`}>
            <a>View Campaign</a>
          </Link>
        ),
        fluid: true,
      };
    });

    return <Card.Group items={items} />;
  }

  return (
    <div>
      <h3>Open Campaigns</h3>
      <Link href="/campaigns/new">
        <a>
          <Button
            floated="right"
            content="Create Campaign"
            icon="add"
            primary
          />
        </a>
      </Link>

      {renderCampaigns()}
    </div>
  );
}

export async function getStaticProps(context) {
  const campaigns = await factory.methods.getDeployedCampaigns().call();

  return {
    revalidate: 1,
    props: {
      campaigns,
    },
  };
}
export default Home;
