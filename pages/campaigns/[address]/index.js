import { useRouter } from "next/router";
import React from "react";
import { Button, Card, Grid } from "semantic-ui-react";
import Link from "next/link";

import web3 from "../../../ethereum/web3";
import ContributeForm from "../../../components/ContributeForm";
import Campaign from "../../../ethereum/campaign";

function CampaignPage({ campaign }) {
  const router = useRouter();
  const { isFallback } = router;

  if (isFallback) {
    return <div>Loading...</div>;
  }
  const {
    minimumContribution,
    balance,
    requestsCount,
    approversCount,
    manager,
  } = campaign;

  function renderCards() {
    const items = [
      {
        header: manager,
        meta: "Address of manager",
        description:
          "The manager created this campaign and can create rquests to withdraw money",
        style: { overflowWrap: "break-word" },
      },
      {
        header: minimumContribution,
        meta: "Minimum contribution (wei)",
        description: "You must contribute this much wei to be an approver",
      },
      {
        header: requestsCount,
        meta: "Number of requests",
        description:
          "A request tried to withdraw money from the contract. Requests must be approved by approvers",
      },
      {
        header: approversCount,
        meta: "Number of approvers",
        description:
          "Number of people that have already donated to this campaign",
      },
      {
        header: web3.utils.fromWei(balance, "ether"),
        meta: "Campaign balance (ether)",
        description:
          "The balance is how much money this campaign has left to spend",
      },
    ];
    return <Card.Group items={items} />;
  }

  return (
    <React.Fragment>
      <h3>Campaign Show</h3>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>{renderCards()}</Grid.Column>
          <Grid.Column width={6}>
            <ContributeForm address={campaign.address} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Link href={`/campaigns/${campaign.address}/requests`}>
              <a>
                <Button content="Requests" primary />
              </a>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </React.Fragment>
  );
}

export async function getStaticPaths() {
  return { paths: [], fallback: true };
}

export async function getStaticProps(context) {
  const { address } = context.params;
  const campainInstance = Campaign(address);
  let campaign = await campainInstance.methods.getSummary().call();
  campaign = JSON.parse(JSON.stringify(campaign));

  return {
    revalidate: 1,
    props: {
      campaign: {
        address,
        minimumContribution: campaign[0],
        balance: campaign[1],
        requestsCount: campaign[2],
        approversCount: campaign[3],
        manager: campaign[4],
      },
    },
  };
}

export default CampaignPage;
