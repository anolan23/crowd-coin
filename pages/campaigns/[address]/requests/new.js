import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import Campaign from "../../../../ethereum/campaign";
import web3 from "../../../../ethereum/web3";
import { Button, Form, Input, Message } from "semantic-ui-react";

function NewRequest({ address }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    value: "",
    description: "",
    recipient: "",
  });
  const [error, setError] = useState({ message: "" });
  const [loading, setLoading] = useState(false);

  const { isFallback } = router;

  if (isFallback) {
    return <div>Loading...</div>;
  }

  async function onSubmit(event) {
    event.preventDefault();
    const campaign = Campaign(address);
    const { value, description, recipient } = formData;
    setLoading(true);
    setError({ message: "" });
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
        .send({
          from: accounts[0],
        });
      router.push(`/campaigns/${address}/requests`);
    } catch (error) {
      setError({ message: error.message });
    }
    setLoading(false);
  }

  return (
    <React.Fragment>
      <Link href={`/campaigns/${address}/requests`}>
        <a>Back</a>
      </Link>
      <h3>Create new request</h3>
      <Form onSubmit={onSubmit} error={!!error.message}>
        <Form.Field>
          <label>Description</label>
          <Input
            value={formData.description}
            onChange={(e) =>
              setFormData((prevState) => {
                return { ...prevState, description: e.target.value };
              })
            }
          />
        </Form.Field>
        <Form.Field>
          <label>Value in ether</label>
          <Input
            value={formData.value}
            onChange={(e) =>
              setFormData((prevState) => {
                return { ...prevState, value: e.target.value };
              })
            }
          />
        </Form.Field>
        <Form.Field>
          <label>Recipient</label>
          <Input
            value={formData.recipient}
            onChange={(e) =>
              setFormData((prevState) => {
                return { ...prevState, recipient: e.target.value };
              })
            }
          />
        </Form.Field>
        <Message error header="Oops!" content={error.message} />
        <Button primary content="Create" loading={loading} />
      </Form>
    </React.Fragment>
  );
}

export async function getStaticPaths() {
  return { paths: [], fallback: true };
}

export async function getStaticProps(context) {
  const { address } = context.params;
  return {
    revalidate: 1,
    props: {
      address,
    },
  };
}

export default NewRequest;
