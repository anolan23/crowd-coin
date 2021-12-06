import React, { useState } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import { useRouter } from 'next/router';

import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';

function New() {
  const router = useRouter();
  const [minContribution, setMinContribution] = useState('');
  const [error, setError] = useState({ message: '' });
  const [loading, setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError({ message: '' });
    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createCampaign(minContribution).send({
        from: accounts[0],
      });
      router.push('/');
    } catch (error) {
      setError({ message: error.message });
    }
    setLoading(false);
  }

  return (
    <React.Fragment>
      <h3>Create a Campaign</h3>
      <Form onSubmit={onSubmit} error={!!error.message}>
        <Form.Field>
          <label>Minimum Contribution</label>
          <Input
            label="wei"
            labelPosition="right"
            value={minContribution}
            onChange={(e) => {
              setMinContribution(e.target.value);
            }}
          />
        </Form.Field>
        <Button primary type="submit" loading={loading}>
          Create
        </Button>
        <Message error header="Oops!" content={error.message} />
      </Form>
    </React.Fragment>
  );
}

export default New;
