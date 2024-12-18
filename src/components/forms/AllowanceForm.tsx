import { Link } from '@nextui-org/react';
import React from 'react';
import { toast } from 'react-toastify';

import { increaseTokenAllowance } from '@/lib/contractHelpers/increaseAllowance';
import { parseToBigInt } from '@/lib/formatBigInt';
import type { TokenAllowanceResponse, TokenSymbol, VaultData } from '@/types';

import { Loading } from '../Loading';
import { MyAlert } from '../MyAlert';
import { MyButton } from '../MyButton';

interface AllowanceProps {
  allowance: TokenAllowanceResponse;
  vault: VaultData;
  token: TokenSymbol;
  handleUpdateAllowance: () => void;
  depositValue?: string;
  allowanceNeedsIncrease: boolean | null | undefined;
}

const AllowanceForm: React.FC<AllowanceProps> = ({
  allowance,
  depositValue,
  vault,
  token,
  allowanceNeedsIncrease,
  handleUpdateAllowance,
}) => {
  const handleSetAllowance = async () => {
    const contractAddress = vault.tokens[token]?.address;
    const decimals = vault.tokens[token]?.decimals;
    if (contractAddress && decimals && depositValue) {
      const amountToAllowBN = parseToBigInt(
        depositValue.toString(),
        Number(decimals),
      );
      try {
        if (contractAddress) {
          const tx = await increaseTokenAllowance(
            contractAddress,
            amountToAllowBN,
          );
          if (tx && tx.status === 'success') {
            toast.success(
              <div>
                <strong>Transaction is succesfull</strong>
                <Link
                  isExternal
                  href={`https://arbiscan.io/tx/${tx.transactionHash}`}
                >
                  Transaction dedails
                </Link>
              </div>,
            );
            handleUpdateAllowance();
          }
        } else {
          toast.error(
            'Error while processing the transaction. Contract Address of a token is not found',
          );
        }
      } catch {
        toast.error('Error while processing the transaction');
      }
    }
  };
  if (allowance.status === 'pending') {
    return <Loading title={`Reading ${token} allowance`} />;
  }
  if (allowance.status === 'error') {
    return (
      <div className="flex h-40 items-center justify-center">
        <MyAlert message={`Error reading ${token} allowance`} color="danger" />;
      </div>
    );
  }

  return (
    <div className="my-4">
      <h3 className="text-lg font-medium">{token}</h3>
      <p>Allowance: {allowance.data}</p>
      <p>Deposit Value: {depositValue}</p>
      {allowanceNeedsIncrease === true && (
        <MyButton onPress={() => handleSetAllowance()} className="my-4">
          Set {token} Allowance
        </MyButton>
      )}
      {allowanceNeedsIncrease === false && (
        <MyAlert
          color="success"
          message={`Allowance for ${token} is already set`}
        />
      )}
    </div>
  );
};

export { AllowanceForm };
