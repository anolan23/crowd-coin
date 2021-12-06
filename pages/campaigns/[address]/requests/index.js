import { useRouter } from "next/router";
import React from "react";
import { Button, Table, Label, Menu, Icon } from "semantic-ui-react";
import Link from "next/link";

import Campaign from "../../../../ethereum/campaign";
import RequestRow from "../../../../components/RequestRow";

function CampaignRequests({ address, requests = [], approversCount }) {
  const router = useRouter();
  const { isFallback } = router;

  if (isFallback) {
    return <div>Loading...</div>;
  }

  function renderRows() {
    return requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          request={request}
          address={address}
          approversCount={approversCount}
        />
      );
    });
  }
  return (
    <React.Fragment>
      <h3>Requests</h3>
      <Link href={`/campaigns/${address}/requests/new`}>
        <a>
          <Button primary content="New request" />
        </a>
      </Link>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Amount</Table.HeaderCell>
            <Table.HeaderCell>Recipient</Table.HeaderCell>
            <Table.HeaderCell>Approval Count</Table.HeaderCell>
            <Table.HeaderCell>Approve</Table.HeaderCell>
            <Table.HeaderCell>Finalize</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{renderRows()}</Table.Body>
      </Table>
    </React.Fragment>
  );
}

export async function getStaticPaths() {
  return { paths: [], fallback: true };
}

export async function getStaticProps(context) {
  const { address } = context.params;
  const campaign = Campaign(address);
  const requestsCount = await campaign.methods.getRequestsCount().call();
  const approversCount = await campaign.methods.approversCount().call();
  console.log("approversCount", approversCount);

  let requests = await Promise.all(
    Array(parseInt(requestsCount))
      .fill()
      .map((element, index) => {
        return campaign.methods.requests(index).call();
      })
  );
  requests = JSON.parse(JSON.stringify(requests));

  console.log(requests);

  return {
    revalidate: 1,
    props: {
      address,
      requests,
      approversCount,
    },
  };
}

export default CampaignRequests;
