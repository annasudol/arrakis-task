/* eslint-disable react-hooks/rules-of-hooks */
import { Spinner } from '@nextui-org/react';
import { useParams } from 'next/navigation';
import React from 'react';

import { Error } from '@/components/Error';
import { StepForm } from '@/components/forms/StepForm';
import { VaultHeader } from '@/components/header/VaultHeader';
import { ValultLayout } from '@/components/layout/ValultLayout';
import { useStore } from '@/store/store';

const Index = () => {
  const params = useParams<{ address: string }>();
  const { vault, fetchVaultData } = useStore();

  React.useEffect(() => {
    fetchVaultData(params?.address);
  }, [params?.address]);

  if (vault.status === 'pending') {
    return (
      <ValultLayout>
        <div className="flex min-h-60 w-full flex-col items-center justify-center">
          <Spinner size="lg" />
        </div>
      </ValultLayout>
    );
  }
  if (vault.status === 'error') {
    return (
      <ValultLayout>
        <Error message="Error" desription={vault.message} />
      </ValultLayout>
    );
  }
  return (
    <ValultLayout>
      <VaultHeader title={vault.data.contractName} tokens={vault.data.tokens} />
      <div className="mx-auto max-w-xl rounded-lg bg-white p-4">
        <StepForm />
      </div>
    </ValultLayout>
  );
};

export default Index;
