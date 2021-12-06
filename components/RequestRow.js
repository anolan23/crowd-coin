import { useState } from "react";
import { Table, Button } from "semantic-ui-react";
import { useRouter } from "next/router";

import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";

function RequestRow({ id, request, address, approversCount }) {
  const router = useRouter();
  const [ether, setEther] = useState("");
  const [error, setError] = useState({ message: "" });
  const [loading, setLoading] = useState(false);

  const { description, value, recipient, complete, approvalCount } = request;
  const readyToFinalize = approvalCount > approversCount / 2;

  async function onApprove() {
    const campaign = Campaign(address);
    const accounts = await web3.eth.getAccounts();
    await campaign.methods.approveRequest(id).send({
      from: accounts[0],
    });
  }

  async function onFinalize() {
    const campaign = Campaign(address);
    const accounts = await web3.eth.getAccounts();
    await campaign.methods.finalizeRequest(id).send({
      from: accounts[0],
    });
  }

  return (
    <Table.Row disabled={complete} positive={readyToFinalize && !complete}>
      <Table.Cell>{id}</Table.Cell>
      <Table.Cell>{description}</Table.Cell>
      <Table.Cell>{web3.utils.fromWei(value, "ether")}</Table.Cell>
      <Table.Cell>{recipient}</Table.Cell>
      <Table.Cell>
        {approvalCount}/{approversCount}
      </Table.Cell>
      <Table.Cell>
        {complete ? null : (
          <Button color="green" basic onClick={onApprove}>
            Approve
          </Button>
        )}
      </Table.Cell>
      <Table.Cell>
        {complete ? null : (
          <Button
            color="teal"
            basic
            onClick={onFinalize}
            disabled={!readyToFinalize}
          >
            Finalize
          </Button>
        )}
      </Table.Cell>
    </Table.Row>
  );
}

export default RequestRow;
