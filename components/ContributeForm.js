import { useState } from "react";
import { Form, Button, Input, Message } from "semantic-ui-react";
import { useRouter } from "next/router";

import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";

function ContributeForm({ address }) {
  const router = useRouter();
  const [ether, setEther] = useState("");
  const [error, setError] = useState({ message: "" });
  const [loading, setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    const campaign = Campaign(address);

    setLoading(true);
    setError({ message: "" });
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(ether, "ether"),
      });
      router.push(`/campaigns/${address}`);
    } catch (error) {
      setError({ message: error.message });
    }
    setLoading(false);
  }

  return (
    <Form onSubmit={onSubmit} error={!!error.message}>
      <Form.Field>
        <label>Amount to contribute</label>
        <Input
          label="ether"
          labelPosition="right"
          value={ether}
          onChange={(e) => {
            setEther(e.target.value);
          }}
        />
      </Form.Field>
      <Button primary type="submit" loading={loading}>
        Contribute
      </Button>
      <Message error header="Oops!" content={error.message} />
    </Form>
  );
}

export default ContributeForm;
